// src/pages/impact.tsx
import WeeklyImpactTracker from '@/components/WeeklyImpactTracker';
import ImpactBarChart from '@/components/ImpactBarChart';
import WaterImpactChart from '@/components/WaterImpactChart';


export default function ImpactPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 pt-28 pb-10">
      <h1 className="text-3xl font-extrabold mb-6 text-green-800">
        Your Weekly Eco Impact
      </h1>

      <WeeklyImpactTracker />

      <section className="mt-12 space-y-10">
        {/* Section 1: Visual Breakdown */}
        <div className="bg-white/80 p-6 rounded-xl shadow-md border-l-4 border-green-300">
          <h2 className="text-xl font-extrabold flex items-center gap-2 mb-2">
            <span>🌱</span>
            <span className="bg-gradient-to-r from-green-700 to-blue-500 text-transparent bg-clip-text">
              What Your Challenges Actually Save
            </span>
          </h2>

          <p className="text-gray-900 mb-4">
            Every small action has an environmental ripple effect. Here's how each EcoLocal challenge stacks up in terms of climate impact:
          </p>

          <ul className="grid sm:grid-cols-2 gap-4 text-sm">
            {[
              {
                icon: '🥦',
                title: 'No Meat Monday',
                co2: '1.5 kg',
                water: '50 L',
              },
              {
                icon: '🚿',
                title: 'Shorter Shower',
                co2: '0.2 kg',
                water: '15 L',
              },
              {
                icon: '♻️',
                title: 'Recycle Something',
                co2: '0.5 kg',
                water: '10 L',
              },
              {
                icon: '🛍️',
                title: 'Reusable Bag',
                co2: '0.15 kg',
                water: '5 L',
              },
              {
                icon: '🚰',
                title: 'Refill Bottle',
                co2: '0.1 kg',
                water: '1 L',
              },
              {
                icon: '💡',
                title: 'Turn Off Lights',
                co2: '0.2 kg',
                water: null,
              },
            ].map((item, idx) => (
              <li
                key={idx}
                className="bg-white p-4 rounded-md shadow-md text-gray-900 transform transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:ring-2 hover:ring-green-300"
              >
                {item.icon}{' '}
                <strong>{item.title}</strong>:<br />
                Saves <strong>{item.co2} CO₂</strong>
                {item.water && <> & <strong>{item.water} water</strong></>}
              </li>
            ))}
          </ul>
        </div>

        <ImpactBarChart />
        <WaterImpactChart />


        {/* Section 2: Educational */}
        <div className="bg-white/80 p-6 rounded-xl shadow-md border-l-4 border-blue-300">
          <h2 className="text-xl font-bold text-blue-800 mb-2">📚 Where the Numbers Come From</h2>
          <p className="text-gray-900 mb-2">
            These values are based on average lifecycle analyses from trusted environmental sources. Our estimates are symbolic but grounded in real data to help you visualize your positive impact.
          </p>
          <ul className="list-disc ml-6 text-gray-800 text-sm space-y-1">
            <li>
              <a
                href="https://www.waterfootprint.org/"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                Water Footprint Network
              </a>
            </li>
            <li>
              <a
                href="https://www.worldwildlife.org/"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                WWF Sustainable Living
              </a>
            </li>
            <li>UN Environment Climate Guide</li>
            <li>JouleBug App Research</li>
            <li>AWorld SDG Estimator (UN-endorsed)</li>
          </ul>
        </div>

        {/* Section 3: Judge Summary */}
        <div className="bg-yellow-100 p-5 rounded-xl shadow-md border-l-4 border-yellow-400 text-sm text-gray-900">
          <p>
            🔎 <strong>Transparency Note:</strong> These values are averages designed to drive awareness — not exact personal carbon calculators. We prioritized clarity + simplicity to encourage action. 💪
          </p>
        </div>
      </section>
    </main>
  );
}
