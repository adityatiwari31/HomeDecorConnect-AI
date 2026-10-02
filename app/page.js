"use client";

import { useState } from "react";

export default function Home() {
  const [product, setProduct] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [buyers, setBuyers] = useState([]);
  const [selectedBuyers, setSelectedBuyers] = useState([]);
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const findBuyers = async () => {
    setLoading(true);

    await new Promise((resolve) =>
      setTimeout(resolve, 1000)
    );

    const response = await fetch("/api/buyers");
    const data = await response.json();

    setBuyers(data);
    setLoading(false);
  };

  const toggleBuyer = (buyer) => {
    const exists = selectedBuyers.find(
      (b) => b.id === buyer.id
    );

    if (exists) {
      setSelectedBuyers(
        selectedBuyers.filter(
          (b) => b.id !== buyer.id
        )
      );
    } else {
      setSelectedBuyers([
        ...selectedBuyers,
        buyer,
      ]);
    }
  };

  const generateEmail = () => {
    const companies = selectedBuyers
      .map((b) => b.company)
      .join(", ");

    setGeneratedEmail(`
Hello ${companies},

We manufacture premium ${product} products and would like to explore wholesale opportunities.

Category: ${category}

Description:
${description}

We believe our products would be a valuable addition to your offerings.

Looking forward to hearing from you.

Best Regards,
Home Decor Supplier
`);
  };

const sendEmail = () => {
  const emails = selectedBuyers
    .map((b) => b.email)
    .join(",");

  const subject = encodeURIComponent(
    "Wholesale Partnership Opportunity"
  );

  const body = encodeURIComponent(
    generatedEmail
  );

  alert(
    "Opening Gmail Draft. Click Send in Gmail."
  );

  window.open(
    `https://mail.google.com/mail/?view=cm&fs=1&to=${emails}&su=${subject}&body=${body}`,
    "_blank"
  );
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-blue-950 text-white">

      <nav className="flex justify-between items-center px-10 py-6 border-b border-white/10">
        <h1 className="text-2xl font-bold">
          HomeDecorConnect
        </h1>

        <button className="bg-blue-600 px-5 py-2 rounded-lg hover:bg-blue-700">
          USA Market
        </button>
      </nav>

      <section className="text-center py-20 px-6">
        <div className="inline-block bg-green-500/20 border border-green-500 px-4 py-2 rounded-full mb-5">
          AI Matching Engine Active
        </div>

        <h1 className="text-6xl font-bold mb-6">
          Find Home Decor Buyers
        </h1>

        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Discover United States buyers, generate
          outreach emails, and connect with
          wholesale partners.
        </p>
      </section>

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-5 px-6 mb-12">

        <div className="bg-white/10 backdrop-blur-lg p-5 rounded-2xl">
          <h2 className="text-gray-300">
            Buyers Found
          </h2>
          <p className="text-4xl font-bold">
            {buyers.length}
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg p-5 rounded-2xl">
          <h2 className="text-gray-300">
            Buyers Selected
          </h2>
          <p className="text-4xl font-bold">
            {selectedBuyers.length}
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg p-5 rounded-2xl">
          <h2 className="text-gray-300">
            Market
          </h2>
          <p className="text-4xl font-bold">
            USA
          </p>
        </div>

      </div>

      <div className="max-w-5xl mx-auto px-6">

        <div className="bg-white text-black rounded-3xl shadow-2xl p-8">

          <h2 className="text-3xl font-bold mb-6">
            Seller Product Details
          </h2>

          <input
            type="text"
            placeholder="Product Name"
            value={product}
            onChange={(e) =>
              setProduct(e.target.value)
            }
            className="w-full border p-4 rounded-xl mb-4"
          />

          <input
            type="text"
            placeholder="Product Category"
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            className="w-full border p-4 rounded-xl mb-4"
          />

          <textarea
            rows="4"
            placeholder="Product Description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            className="w-full border p-4 rounded-xl mb-4"
          />

          <button
            onClick={findBuyers}
            className="w-full bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700"
          >
            {loading
              ? "Searching US Buyers..."
              : "Find Buyers"}
          </button>

        </div>

        {buyers.length > 0 && (
          <div className="mt-10">

            <h2 className="text-4xl font-bold mb-6">
              Potential Buyers
            </h2>

            {buyers.map((buyer) => (
              <div
                key={buyer.id}
                className="bg-white text-black p-6 rounded-2xl mb-5 shadow-lg hover:scale-[1.01] transition"
              >
                <div className="flex justify-between items-center">

                  <div>
                    <h3 className="text-2xl font-bold">
                      {buyer.company}
                    </h3>

                    <p>{buyer.email}</p>
                    <p>{buyer.city}</p>
                    <p>{buyer.category}</p>

                    <p className="text-green-600 font-bold mt-2">
                      Match Score: {buyer.match}
                    </p>

                  </div>

                  <input
  type="checkbox"
  className="w-6 h-6"
  checked={selectedBuyers.some(
    (b) => b.id === buyer.id
  )}
  onChange={() => toggleBuyer(buyer)}
/>

                </div>
              </div>
            ))}

            <button
              onClick={generateEmail}
              className="bg-green-600 px-6 py-4 rounded-xl hover:bg-green-700"
            >
              Generate Email
            </button>

          </div>
        )}

        {generatedEmail && (
          <div className="bg-white text-black rounded-2xl p-6 mt-10 mb-12">

            <h2 className="text-3xl font-bold mb-5">
              Generated Outreach Email
            </h2>

            <textarea
              value={generatedEmail}
              readOnly
              rows="12"
              className="w-full border rounded-xl p-4"
            />

            <div className="flex gap-4 mt-5">

              <button
                onClick={() =>
                  navigator.clipboard.writeText(
                    generatedEmail
                  )
                }
                className="bg-blue-600 text-white px-5 py-3 rounded-xl"
              >
                Copy Email
              </button>

              <button
                onClick={sendEmail}
                className="bg-green-600 text-white px-5 py-3 rounded-xl"
              >
                Send Email
              </button>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}