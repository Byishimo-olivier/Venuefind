import { Link } from 'react-router-dom';
import './venues.css';

const ballroomImage =
  'https://images.pexels.com/photos/169190/pexels-photo-169190.jpeg?auto=compress&cs=tinysrgb&w=900';

export default function VenueReviews() {
  return (
    <main className="reviews-page">
      <ReviewsHeader />
      <section className="reviews-wrap">
        <div className="reviews-hero">
          <div>
            <h1>Guest Perspectives</h1>
            <p>Unfiltered experiences from verified events at the Kigali Heights Grand Ballroom.</p>
          </div>
          <aside className="rating-summary">
            <strong>4.8</strong>
            <span>/ 5</span>
            <p>★★★★★</p>
            <small>Based on 142 verified reviews</small>
          </aside>
        </div>

        <div className="reviews-layout">
          <aside className="detailed-ratings">
            <h2>Detailed Ratings</h2>
            {[
              ['Cleanliness', '4.9', '98%'],
              ['Service', '4.8', '96%'],
              ['Value', '4.5', '90%'],
              ['Location', '4.7', '94%'],
            ].map(([label, value, width]) => (
              <div className="rating-row" key={label}>
                <span>{label}</span>
                <i><b style={{ width }} /></i>
                <em>{value}</em>
              </div>
            ))}
          </aside>

          <section className="review-stream">
            <div className="review-tabs">
              <button className="active">All Reviews</button>
              <button>With Photos</button>
              <button>Weddings</button>
              <Link to="/venues/akagera/review/new">Leave your Review</Link>
            </div>

            <article className="featured-review">
              <div className="review-copy">
                <div className="reviewer-line">
                  <span className="review-avatar">A</span>
                  <div><strong>Aline M.</strong><small>Verified Corporate Client · Oct 2026</small></div>
                  <b>★★★★★</b>
                </div>
                <h2>Impeccable execution for our tech summit</h2>
                <p>The ballroom exceeded our expectations. The natural light from the floor-to-ceiling windows overlooking Kigali was stunning. Catering seamlessly handled 300 guests without feeling crowded.</p>
                <blockquote>
                  <strong>Response from Venue Manager</strong>
                  Thank you, Aline. It was a pleasure hosting your summit. We hope to welcome your team back to Kigali soon.
                </blockquote>
              </div>
              <img src={ballroomImage} alt="Reviewed ballroom event setup" />
            </article>

            <article className="plain-review">
              <div className="reviewer-line">
                <span className="review-avatar">J</span>
                <div><strong>Jean-Paul R.</strong><small>Verified Wedding Client · Sep 2026</small></div>
                <b>★★★★☆</b>
              </div>
              <h2>A beautiful night, slight delay in service</h2>
              <p>The venue is undoubtedly one of the most beautiful in Kigali. The decor team transformed the space magically for our reception. Our only minor note was that dinner service started about 30 minutes later than scheduled.</p>
            </article>

            <button className="load-more">Load More Experiences⌄</button>
          </section>
        </div>
      </section>
      <ReviewsFooter />
    </main>
  );
}

export function ReviewsHeader() {
  return (
    <header className="reviews-header">
      <Link to="/venues" className="reviews-logo">VenueElite</Link>
      <nav>
        <Link to="/venues">Discover</Link>
        <Link to="/venues/search">Collections</Link>
        <Link className="active" to="/venues/akagera/reviews">Reviews</Link>
        <Link to="/venues/akagera/book">Concierge</Link>
      </nav>
      <div>
        <input placeholder="Search venues..." />
        <Link to="/owner/register">List Your Venue</Link>
        <span>♧ ◎</span>
      </div>
    </header>
  );
}

export function ReviewsFooter() {
  return (
    <footer className="reviews-footer">
      <strong>VenueElite</strong>
      <span>© 2026 VenueElite Discovery. The Digital Concierge Framework.</span>
      <nav>Privacy Policy&nbsp;&nbsp;&nbsp;Terms of Service&nbsp;&nbsp;&nbsp;Press Kit&nbsp;&nbsp;&nbsp;Contact Support</nav>
    </footer>
  );
}
