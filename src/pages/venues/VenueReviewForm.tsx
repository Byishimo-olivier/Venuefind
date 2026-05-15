import { Link } from 'react-router-dom';
import { ReviewsHeader } from './VenueReviews';
import './venues.css';

export default function VenueReviewForm() {
  return (
    <main className="review-form-page">
      <ReviewsHeader />
      <section className="review-form-wrap">
        <aside className="review-venue-card">
          <div>
            <img src="https://images.pexels.com/photos/265920/pexels-photo-265920.jpeg?auto=compress&cs=tinysrgb&w=700" alt="" />
            <span>Elite Partner</span>
            <h2>The Grand Arch Ballroom</h2>
            <p>⌖ Downtown Historic District</p>
          </div>
          <article>
            <h3>Your Review Matters</h3>
            <p>Sharing your detailed experience helps future guests make informed decisions and allows our venue partners to elevate their service.</p>
            <small>◎ Verified Guest Review</small>
          </article>
        </aside>

        <form className="review-form-card">
          <h1>Share Your Experience</h1>
          <p>Detail your event experience at The Grand Arch Ballroom.</p>

          <section>
            <h2>Rate Your Visit</h2>
            <div className="rate-grid">
              {['Overall Experience', 'Cleanliness & Ambiance', 'Staff & Service', 'Value for Investment'].map((label) => (
                <label key={label}>
                  <span>{label}</span>
                  <b>☆☆☆☆☆</b>
                </label>
              ))}
            </div>
          </section>

          <section>
            <h2>The Details</h2>
            <label>Review Title<input placeholder="Summarize your experience (e.g., A Magical Evening)" /></label>
            <label>Detailed Experience<textarea placeholder="What stood out to you? Mention specific amenities, staff interactions, or moments that made your event special." /></label>
            <small>Minimum 100 characters required.</small>
          </section>

          <section>
            <h2>Photos & Videos</h2>
            <p>Visuals help convey the atmosphere. Upload high-quality moments from your event.</p>
            <div className="dropzone">
              <strong>☁</strong>
              <span>Drag and drop media here<br />or click to browse your files</span>
              <button type="button">Browse Files</button>
              <small>JPG, PNG or MP4. Max 50MB total.</small>
            </div>
          </section>

          <div className="review-actions">
            <button type="button">Save Draft</button>
            <Link to="/venues/akagera/reviews">Submit Review</Link>
          </div>
        </form>
      </section>
    </main>
  );
}
