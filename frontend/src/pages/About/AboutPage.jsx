import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../components/EverestCard.css";

export function AboutPage() {
  return (
    <div
      className="is-flex is-flex-direction-column"
      style={{ minHeight: "100vh", position: "relative" }}
    >
      {/* Background video */}
      <video
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -1,
        }}
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/piano.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Header with nav */}
      <Header showNav={true} />

      {/* Main content with dynamic background color */}
      <main
        className="home is-flex-grow-1 is-flex is-justify-content-center is-align-items-center"
        style={{ position: "relative", zIndex: 1 }}
      >
        <div
          className="box is-hoverable"
          style={{
            maxWidth: "800px",
            width: "90%",
            backgroundColor: "rgba(241, 200, 146, 1)",
          }}
        >
          <div className="content has-text-centered">
            <h1
              className="title is-3 is-hoverable"
              style={{ color: "white" }}
            >
              About My Everest
            </h1>
            <p
              className="has-text-white"
              style={{ textAlign: "left", color: "white" }}
            >
              <strong style={{ color: "white" }}>What is an Everest?</strong>
              <br />
              An <strong style={{ color: "white" }}>Everest</strong> is your personal mountain—your biggest challenge, your greatest aspiration. Just like the first climbers who faced the towering, unforgiving peaks of Mount Everest, you have your own summits to conquer. Whether it’s training for a marathon, mastering a musical instrument, launching a new career, or even the literal climb of Everest itself, your <strong style={{ color: "white" }}>Everests</strong> represent the goals that push you beyond your limits.
              <br />
              <br />

              <strong style={{ color: "white" }}>Breaking Down the Climb</strong>
              <br />
              Every mountain is climbed one step at a time. That’s why <strong style={{ color: "white" }}>My Everest</strong> helps you break your long-term goals into clear, manageable <strong style={{ color: "white" }}>milestones</strong>. These milestones act like checkpoints along your path—each one a victory to celebrate and a motivation to keep moving forward.
              <br />
              <br />

              <strong style={{ color: "white" }}>Track, Celebrate, and Inspire</strong>
              <br />
              With <strong style={{ color: "white" }}>My Everest</strong>, you can track your progress, check off milestones, and watch your journey unfold. And because no journey is made alone, you can choose to share your <strong style={{ color: "white" }}>Everests</strong> publicly on your personal Everests page—connecting with others, inspiring and being inspired by a community of fellow climbers who are reaching for their own summits.
              <br />
              <br />

              <strong style={{ color: "white" }}>Your Everest Awaits</strong>
              <br />
              Remember, every step forward, no matter how small, brings you closer to your peak. So gear up, start climbing, and make your dreams your reality. Your <strong style={{ color: "white" }}>Everests</strong> are waiting—are you ready to begin?
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
