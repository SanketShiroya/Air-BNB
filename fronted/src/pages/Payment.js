import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const Payment = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  useEffect(() => {
    if (id) {
      axios.get('http://localhost:4000/bookings').then(response => {
        const foundBooking = response.data.find(({ _id }) => _id === id);
        if (foundBooking) {
          setBooking(foundBooking);
        }
      });
    }
  }, [id]);

  async function bookpayment(ev) {
    ev.preventDefault();
    try {
      await axios.post('http://localhost:4000/order', {
        amount: booking.price
      })
      window.location.replace('http://localhost:4000/payment');

      alert('Book payment call successful.');
    }
    catch (e) {
      alert('Registration failed. Please try again later');
      alert(e)
    }


  }


  if (!booking) {
    return '';
  }

  return (
    <>

      <div className="bg-primary p-6 text-white rounded-2xl">
        <div>Total price</div>
        <div className="text-3xl">${booking.price}</div>
      </div>

      <div class="d-flex justify-content-center">
        <div class="mb-3">
          <label for="amountInput" class="form-label">Do Payment</label>

          <div id="amountHelp" class="form-text"></div>
        </div>

        <div class="d-grid">
          <button type="button" onClick={bookpayment} class="btn btn-primary bg-primary px-6 py-4 text-white rounded-2xl" id="getOrderIdBtn">Submitt</button>
        </div>
      </div>
    </>
  );
}


export default Payment;