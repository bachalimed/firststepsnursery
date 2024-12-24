//the public facing webpage when not logged in
import buildingface from "../Data/buildingface.jpg";
import PublicHeader from "../Components/Shared/Header/PublicHeader";
import PublicFooter from "../Components/Shared/Footer/PublicFooter";
// import { Link } from 'react-router-dom';
// import { Outlet } from 'react-router-dom';

const Public = () => {
  const content = (
    <section className="public">
      <PublicHeader />

      <main className="public__main">
        {/* Hero Section */}
        <section className="public__hero">
          <h1>Welcome to Our Wraparound Nursery</h1>
          <p>
            Offering flexible, high-quality childcare services to support
            families and foster your child's growth.
          </p>
          <img
            src={buildingface}
            alt="two mascots "
            className="public__hero-image"
          />
        </section>

        {/* About Section */}
        <section className="public__about">
          <h2>About Us</h2>
          <p>
            Our wraparound nursery provides a nurturing environment designed to
            inspire curiosity, creativity, and confidence in your child. We
            offer tailored programs for children of all ages and needs.
          </p>
          <div className="public__media">
            <img
              src="https://via.placeholder.com/400x300"
              alt="Childcare activities"
              className="public__media-image"
            />
            <img
              src="https://via.placeholder.com/400x300"
              alt="Outdoor play"
              className="public__media-image"
            />
          </div>
        </section>
        {/* our vision */}
        <section className="public__about">
          <h2>Our Vision</h2>
          <p>
            “using in state-of-the-art facilities, we provide a safe and healthy
            environment for our students to achieve academic excellence and
            become a confident responsible citizen”
          </p>
        </section>
        {/* our goals */}
        <section className="public__about">
          <h2>Our Goals</h2>
          <p>
            Foster academic curiosity through encouraging high-level thinking
            and intellectually rigorous activity
          </p>
          <p>
            Provide bespoke support to assist learning and remove barriers to
            progression
          </p>
          <p>Promote extracurricular life</p>
          <p>
            Emphasize the importance of civic engagement and of cultivating
            positive relationships within the community
          </p>
          <p>Optimize the financial efficiency of the nursery.</p>
          <p>
            Make use of recent technology tools and methods to accomplish the
            nursery mission
          </p>
        </section>

        {/* Services Section */}
        <section className="public__services">
          <h2>Our Services</h2>
          <ul className="public__services-list">
            <li>Before & After School Care</li>
            <li>Nursery Sessions</li>
            <li>Holiday Clubs</li>
            <li>Flexible Pick-Up & Drop-Off Times</li>
          </ul>
        </section>

        {/* Testimonials Section */}
        <section className="public__testimonials">
          <h2>What Parents Say</h2>
          <blockquote className="public__testimonial">
            <p>
              "The staff are so friendly and professional. My child loves coming
              here and has grown so much in confidence!"
            </p>
            <cite>- Happy Parent</cite>
          </blockquote>
        </section>

        {/* Contact Section */}
        <section className="public__contact">
          <h2>Get in Touch</h2>
          <p>
            Ready to join our nursery family? Contact us today to learn more or
            schedule a visit.
          </p>
          
         
          <p>Click the link below to open the location on Google Maps:</p>
          <button
            className="public__contact-button"
            href="https://maps.app.goo.gl/2awR9BZX5n1vLKgt6"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open Location in Google Maps
          </button>
        </section>
      </main>

      <PublicFooter />
    </section>
  );
  return content;
};

export default Public;
