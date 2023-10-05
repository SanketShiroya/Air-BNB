const express = require('express');
var cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user');
const Place = require('./models/place');
const Booking = require('./models/Booking.js');
var jwt = require('jsonwebtoken');
const bodyParser = require('body-parser')

var cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const multer = require('multer');
const fs = require('fs');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const mime = require('mime-types');
const indexWebRoutes = require('./routes/web/index');
const paymentWebRoutes = require('./routes/web/payments');
const expressLayouts = require('express-ejs-layouts')
const Razorpay = require('razorpay')


const UserModel = require('./models/user');
const { nanoid } = require('nanoid');
const paymentDetail = require('./models/payment-detail');
// const paymentRoutes = require("./Routes/payment")

require('dotenv').config();
const app = express();
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'fghjgnfasfyyvnhbiusydgfyugavbauyg67rwo'
const bucket = 'Eleven-booking-app';
const razorPayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
})
app.use(express.json());
// app.use("/pay/",paymentRoutes);
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));


app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000',
}));

// copy from kenil
app.use(expressLayouts)
app.set('layout', './layouts/default')
app.set('view engine', 'ejs')
app.use('/', indexWebRoutes);
app.use('/payment', paymentWebRoutes);

app.use(express.static('public'));
app.use('/images', express.static(__dirname + 'public/images'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
// app.use(function(req, res, next) {
// 	var err = new Error('Not Found');
// 	err.status = 404;
// 	next(err);
// });

// app.use(function(err, req, res, next) {
//   // render the error page
// res.status(err.status || 500);
// res.render('pages/error', {
//   title: err.status,
//   status: err.status,
//   message: err.message
// });
// });


mongoose.connect(process.env.MONGO_URL);

app.get('/test', (req, res) => {
  res.json('run okay');
});
// MvM3kEc2z3BoisVi
async function uploadToS3(path, originalFilename, mimetype) {
  const client = new S3Client({
    region: 'us-east-1',
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });
  const parts = originalFilename.split('.');
  const ext = parts[parts.length - 1];
  const newFilename = Date.now() + '.' + ext;
  await client.send(new PutObjectCommand({
    Bucket: bucket,
    Body: fs.readFileSync(path),
    Key: newFilename,
    ContentType: mimetype,
    ACL: 'public-read',
  }));
  return `https://${bucket}.s3.amazonaws.com/${newFilename}`;
}

function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      resolve(userData);
    });
  });
}

app.get('/test', (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  res.json('test ok');
});

app.post('/register', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { name, email, password, role } = req.body;

  try {
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
      role
    });
    res.json(userDoc);
  } catch (e) {
    res.status(422).json(e);
  }

});

app.post('/login', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign({
        email: userDoc.email,
        id: userDoc._id
      }, jwtSecret, {}, (err, token) => {
        if (err) throw err;
        res.cookie('token', token).json(userDoc);
      });
    } else {
      res.status(422).json('pass not ok');
    }
  } else {
    res.status(422).json('not found');
  }
});

app.get('/profile', (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const { name, email, _id, role } = await User.findById(userData.id);
      res.json({ name, email, _id, role });
    });
  } else {
    res.json(null);
  }
});

app.post('/logout', (req, res) => {
  res.cookie('token', '').json(true);
});

console.log({ __dirname });
app.post('/upload-by-link', async (req, res) => {
  const { link } = req.body;
  const newName = 'photo' + Date.now() + '.jpg';
  await imageDownloader.image({
    url: link,
    // dest: '/tmp/' +newName,
    dest: __dirname + '/uploads/' + newName,
  });
  // const url = await uploadToS3('/tmp/' +newName, newName, mime.lookup('/tmp/' +newName));
  // res.json(url);
  res.json(newName);

});

const photosMiddleware = multer({ dest: 'uploads/' });
app.post('/upload', photosMiddleware.array('photos', 100), async (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace('uploads\\', ''));
  }

  // updated ============
  // for (let i = 0; i < req.files.length; i++) {
  //   const {path,originalname,mimetype} = req.files[i];
  //   const url = await uploadToS3(path, originalname, mimetype);
  //   uploadedFiles.push(url);
  // }
  res.json(uploadedFiles);

});

app.post('/places', (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  const {
    title, address, addedPhotos, description, price,
    perks, extraInfo, checkIn, checkOut, maxGuests,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.create({
      owner: userData.id, price,
      title, address, photos: addedPhotos, description,
      perks, extraInfo, checkIn, checkOut, maxGuests,
    });
    res.json(placeDoc);
  });
});

app.get('/user-places', (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    const { id } = userData;
    res.json(await Place.find({ owner: id }));
  });
});

app.get('/places/:id', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { id } = req.params;
  res.json(await Place.findById(id));
});

app.put('/places', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  const {
    id, title, address, addedPhotos, description,
    perks, extraInfo, checkIn, checkOut, maxGuests, price,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.findById(id);
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title, address, photos: addedPhotos, description,
        perks, extraInfo, checkIn, checkOut, maxGuests, price,
      });
      await placeDoc.save();
      res.json('ok');
    }
  });
});

app.get('/places', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  res.json(await Place.find());
});

app.post('/bookings', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const userData = await getUserDataFromReq(req);
  const {
    place, checkIn, checkOut, numberOfGuests, name, phone, price,
  } = req.body;
  Booking.create({
    place, checkIn, checkOut, numberOfGuests, name, phone, price,
    user: userData.id,
  }).then((doc) => {
    res.json(doc);
  }).catch((err) => {
    throw err;
  });
});



app.get('/bookings', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const userData = await getUserDataFromReq(req);
  res.json(await Booking.find({ user: userData.id }).populate('place'));
});

app.get('/getuser', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  try {
    const response = await User.find();
    res.status(200).send(response)
  } catch (error) {
    res.status(400).send(error);
  }
})


app.get('/forprice', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const userData = await getUserDataFromReq(req);
  res.json(await Booking.find({ user: userData.id }).populate('place'));
  console.log(userData);
});

app.delete("/deleteproduct/:id", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  try {
    const _id = req.params.id;
    const deleteProduct = await UserModel.findByIdAndDelete(_id);
    res.status(200).send(deleteProduct);
  } catch (error) {
    res.status(400).send(error.message);
  }
})


app.post('/order', function (req, res, next) {
  console.log(req.body.amount);
  params = {
    amount: req.body.amount * 100,
    currency: "INR",
    receipt: nanoid(),
    payment_capture: "1"
  }
  razorPayInstance.orders.create(params)
    .then(async (response) => {
      const razorpayKeyId = process.env.RAZORPAY_KEY_ID
      // Save orderId and other payment details
      const PaymentDetail = new paymentDetail({
        orderId: response.id,
        receiptId: response.receipt,
        amount: response.amount,
        currency: response.currency,
        createdAt: response.created_at,
        status: response.status
      })
      try {
        // Render Order Confirmation page if saved succesfully
        await PaymentDetail.save()
        res.render('pages/payment/checkout', {
          title: "Confirm Order",
          razorpayKeyId: razorpayKeyId,
          paymentDetail: paymentDetail
        })
      } catch (err) {
        // Throw err if failed to save
        if (err) throw err;
      }
    }).catch((err) => {
      // Throw err if failed to create order
      if (err) throw err;
    })
});



app.post('/verify', async function (req, res, next) {
  body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
  let crypto = require("crypto");
  let expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  // Compare the signatures
  if (expectedSignature === req.body.razorpay_signature) {
    // if same, then find the previosuly stored record using orderId,
    // and update paymentId and signature, and set status to paid.
    await PaymentDetail.findOneAndUpdate(
      { orderId: req.body.razorpay_order_id },
      {
        paymentId: req.body.razorpay_payment_id,
        signature: req.body.razorpay_signature,
        status: "paid"
      },
      { new: true },
      function (err, doc) {
        // Throw er if failed to save
        if (err) {
          throw err
        }
        // Render payment success page, if saved succeffully
        res.render('pages/payment/success', {
          title: "Payment verification successful",
          paymentDetail: doc
        })
      }
    );
  } else {
    res.render('pages/payment/fail', {
      title: "Payment verification failed",
    })
  }
});

app.listen(4000);