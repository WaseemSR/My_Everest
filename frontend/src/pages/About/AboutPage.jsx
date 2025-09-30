import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../components/EverestCard.css";

export function AboutPage() {
  return (
    <div className="is-flex is-flex-direction-column" style={{ minHeight: "100vh", backgroundColor: "#1b262c" }}>
      <Header showNav={true} />

      <main className="is-flex-grow-1 m-6" style={{ position: "relative", zIndex: 1, backgroundColor: "#1b262c" }}>
        <section
          
        >
          <header className="title is-1 has-text-white mb-6">About My Everest</header>
        </section>

        <div style={{ display: "flex", gap: "1.5rem", alignItems: "stretch", margin: "1.5rem 0" }}>
          <section
            className="box is-hoverable"
            style={{
              backgroundColor: "transparent",
              width: "50%",
              margin: "0 auto",          // centers the BOX itself on the page
              display: "flex",           // flex container
              flexDirection: "column",   // keep your h2 + p stacked
              justifyContent: "center",  // vertical centering
              alignItems: "center",      // horizontal centering
              minHeight: "300px"         // give it some height so centering actually shows
            }}
          >
            <h2 className="has-text-white title is-2">What is an Everest</h2>
            <p className="has-text-white is-size-4">
              An Everest is your personal mountain—your biggest challenge, your greatest aspiration. Just like the first
              climbers who faced the towering, unforgiving peaks of Mount Everest, you have your own summits to conquer.
              Whether it’s training for a marathon, mastering a musical instrument, launching a new career, or even the
              literal climb of Everest itself, your <strong style={{ color: "white" }}>Everests</strong> represent the goals
              that push you beyond your limits.
            </p>
          </section>

          <div style={{ width: "50%", display: "flex", alignItems: "center" }}>
            <img
              src="/Mount-Everest .png"
              alt="Mount Everest"
              style={{ width: "100%", height: "auto", borderRadius: "6px", objectFit: "cover" }}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: "1.5rem", alignItems: "stretch", margin: "1.5rem 0" }}>
          <div style={{ width: "50%", display: "flex", alignItems: "center" }}>
            <img
              src="/Marathon 2.png"
              alt="Marathon"
              style={{ width: "100%", height: "auto", borderRadius: "6px", objectFit: "cover" }}
            />
          </div>
          <section
            className="box is-hoverable"
            style={{
              backgroundColor: "transparent",
              width: "50%",
              margin: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "300px"
            }}
          >
            <h2 className="has-text-white title is-3">Breaking Down the Climb</h2>
            <p className="has-text-white is-size-4">
              Every mountain is climbed one step at a time. That’s why <strong style={{ color: "white" }}>My Everest</strong>
              helps you break your long-term goals into clear, manageable <strong style={{ color: "white" }}>milestones</strong>.
              These milestones act like checkpoints along your path—each one a victory to celebrate and a motivation to keep
              moving forward.
              <br />
            </p>
          </section>
        </div>
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "stretch", margin: "1.5rem 0" }}>
          <section
            className="box is-hoverable"
            style={{
              backgroundColor: "transparent",
              width: "50%",
              margin: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "300px"
            }}
          >
            <h2 className="has-text-white title is-2">Track, Celebrate, and Inspire</h2>
            <p className="has-text-white is-size-4">
              With My Everest, you can track your progress, check off milestones, and watch your journey unfold. And because
              no journey is made alone, you can choose to share your Everests publicly on your personal Everests page—connecting
              with others, inspiring and being inspired by a community of fellow climbers who are reaching for their own summits.
              <br />
            </p>
          </section>
          <div style={{ width: "50%", display: "flex", alignItems: "center" }}>
            <img
              src="/Biking 2.png"
              alt="Biking"
              style={{ width: "100%", height: "auto", borderRadius: "6px", objectFit: "cover" }}
            />
          </div>
        </div>


        <div style={{ display: "flex", gap: "1.5rem", alignItems: "stretch", margin: "1.5rem 0" }}>
          <div style={{ width: "50%", display: "flex", alignItems: "center" }}>
            <img
              src="/Guitar 2.png"
              alt="Guitar practice"
              style={{ width: "100%", height: "auto", borderRadius: "6px", objectFit: "cover" }}
            />
          </div>
          <section
            className="box is-hoverable"
            style={{
              backgroundColor: "transparent",
              width: "50%",
              margin: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "300px"
            }}
          >
            <h2 className="has-text-white title is-2">Your Everest Awaits</h2>
            <p className="has-text-white is-size-4">
              Remember, every step forward, no matter how small, brings you closer to your peak. So gear up, start climbing,
              and make your dreams your reality. Your <strong style={{ color: "white" }}>Everests</strong> are waiting—are you
              ready to begin?
              <br />
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
