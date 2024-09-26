import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <>
      <h5 className="text-2xl font-semibold mb-4">Privacy Policy</h5>
      <div className="max-h-96 overflow-y-auto">
        <p className="mb-4">
          Your privacy is important to us. It is Collabberry's policy to respect
          your privacy regarding any information we may collect from you across
          our website, http://collabberry.com, and other sites we own and
          operate.
        </p>
        <h2 className="text-2xl font-semibold mb-2">
          1. Information we collect
        </h2>
        <p className="mb-4">
          We only collect information about you if we have a reason to do so —
          for example, to provide our services, to communicate with you, or to
          make our services better.
        </p>
        <h2 className="text-2xl font-semibold mb-2">
          2. How we use information
        </h2>
        <p className="mb-4">
          We use the information we collect in various ways, including to
          provide, operate, and maintain our website, improve, personalize, and
          expand our website, understand and analyze how you use our website,
          develop new products, services, features, and functionality,
          communicate with you, either directly or through one of our partners,
          including for customer service, to provide you with updates and other
          information relating to the website, and for marketing and promotional
          purposes.
        </p>
        <h2 className="text-2xl font-semibold mb-2">3. Sharing information</h2>
        <p className="mb-4">
          We do not share your personal information with anyone except to comply
          with the law, develop our products, or protect our rights.
        </p>
        <h2 className="text-2xl font-semibold mb-2">4. Security</h2>
        <p className="mb-4">
          We take reasonable measures to help protect your personal information
          from loss, theft, misuse, and unauthorized access, disclosure,
          alteration, and destruction.
        </p>
        <h2 className="text-2xl font-semibold mb-2">5. Contact us</h2>
        <p className="mb-4">
          If you have any questions about this Privacy Policy, please contact us
          at support@collabberry.com.
        </p>
      </div>
    </>
  );
};

export default PrivacyPolicy;
