//the public facing webpage when not logged in
import buildingface from '../Data/buildingface.jpg'
import PublicHeader from '../Components/Shared/Header/PublicHeader'
import PublicFooter from '../Components/Shared/Footer/PublicFooter'
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
				Offering flexible, high-quality childcare services to support families and foster your child's growth.
			  </p>
			  <img
				src={buildingface}
				alt="Happy children playing"
				className="public__hero-image"
			  />
			</section>
	
			{/* About Section */}
			<section className="public__about">
			  <h2>About Us</h2>
			  <p>
				Our wraparound nursery provides a nurturing environment designed to inspire curiosity, creativity, and confidence in your child. We offer tailored programs for children of all ages and needs.
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
				  "The staff are so friendly and professional. My child loves coming here and has grown so much in confidence!"
				</p>
				<cite>- Happy Parent</cite>
			  </blockquote>
			</section>
	
			{/* Contact Section */}
			<section className="public__contact">
			  <h2>Get in Touch</h2>
			  <p>
				Ready to join our nursery family? Contact us today to learn more or schedule a visit.
			  </p>
			  <button className="public__contact-button">Contact Us</button>
			</section>
		  </main>
	
		  <PublicFooter />
		</section>
	  );
	  return content;
	};
	
	export default Public;