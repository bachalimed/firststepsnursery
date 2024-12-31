import buildingface from "../Data/buildingface.jpg";
import PublicHeader from "../Components/Shared/Header/PublicHeader";
import PublicFooter from "../Components/Shared/Footer/PublicFooter";

const Public = () => {
  const content = (
    <section className="public bg-gray-100 text-gray-800">
      <PublicHeader />

      <main className="public__main px-6 py-6">
        {/* Hero Section */}
        <section className="public__hero text-center mb-4">
          <h1 className="text-4xl font-bold text-teal-600 mb-4">
            Welcome to Our Wraparound Nursery
          </h1>
          <p className="text-lg text-gray-700 mb-4">
            Offering flexible, high-quality childcare services to support
            families and foster your child's growth.
          </p>
          <img
            src={buildingface}
            alt="two mascots"
            className="public__hero-image mx-auto rounded-lg shadow-lg"
          />
        </section>

        <section className="public__about mb-4">
        <a
            href="https://maps.app.goo.gl/2awR9BZX5n1vLKgt6"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-sky-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-sky-600"
            >
            Open Location in Google Maps
          </a>

            </section>


        {/* About Section */}
        <section className="public__about mb-4">
          <h2 className="text-3xl font-semibold text-sky-600 mb-4">About Us</h2>
          <p className="text-gray-700">
            Our wraparound nursery provides a nurturing environment designed to
            inspire curiosity, creativity, and confidence in your child. We
            offer tailored programs for children of all ages and needs.
          </p>
        </section>

        {/* Our Vision */}
        <section className="public__vision mb-4">
          <h2 className="text-3xl font-semibold text-fuchsia-500 mb-4">
            Our Vision
          </h2>
          <p className="text-gray-700 italic">
            “Using state-of-the-art facilities, we provide a safe and healthy
            environment for our students to achieve academic excellence and
            become confident, responsible citizens.”
          </p>
        </section>

        {/* Our Goals */}
        <section className="public__goals mb-4">
          <h2 className="text-3xl font-semibold text-green-600 mb-4">Our Goals</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>
              Foster academic curiosity through encouraging high-level thinking
              and intellectually rigorous activity.
            </li>
            <li>
              Provide bespoke support to assist learning and remove barriers to
              progression.
            </li>
            <li>Promote extracurricular life.</li>
            <li>
              Emphasize the importance of civic engagement and cultivating
              positive relationships within the community.
            </li>
            <li>Optimize the financial efficiency of the nursery.</li>
            <li>
              Utilize modern technology tools and methods to accomplish the
              nursery mission.
            </li>
          </ul>
        </section>

        {/* Services Section */}
        <section className="public__services mb-4">
          <h2 className="text-3xl font-semibold text-red-600 mb-4">
            Our Services
          </h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Before & After School Care</li>
            <li>Nursery Sessions</li>
            <li>Holiday Clubs</li>
            <li>Flexible Pick-Up & Drop-Off Times</li>
          </ul>
        </section>

        {/* Testimonials Section */}
        <section className="public__testimonials mb-4">
          <h2 className="text-3xl font-semibold text-sky-500 mb-4">
            What Parents Say
          </h2>
          <blockquote className="public__testimonial italic text-gray-700 border-l-4 border-teal-500 pl-4">
            <p>
              "The staff are so friendly and professional. My child loves coming
              here and has grown so much in confidence!"
            </p>
            <cite className="text-gray-600 block mt-2">- Happy Parent</cite>
          </blockquote>
        </section>

        {/* Contact Section */}
        <section className="public__contact text-center">
          <h2 className="text-3xl font-semibold text-sky-600 mb-4">
            Get in Touch
          </h2>
          <p className="text-gray-700 mb-4">
            Ready to join our nursery family? Contact us today to learn more or
            schedule a visit.
          </p>
          <p className="text-gray-700 mb-4">
            Click the button below to open the location on Google Maps:
          </p>
          <a
            href="https://maps.app.goo.gl/2awR9BZX5n1vLKgt6"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-sky-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-sky-600"
          >
            Open Location in Google Maps
          </a>
        </section>
      </main>

      <PublicFooter />
    </section>
  );
  return content;
};

export default Public;
