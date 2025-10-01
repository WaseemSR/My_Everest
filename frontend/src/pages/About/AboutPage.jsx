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
              margin: "0 auto",        
              display: "flex",       
              flexDirection: "column",  
              justifyContent: "center", 
              alignItems: "center",    
              minHeight: "300px"         
            }}
          >
            <h2 className="has-text-white title is-2">What is an Everest</h2>
            <p className="has-text-white is-size-4">
              An Everest is your personal mountain—your biggest challenge, your proudest victory waiting to happen. For some, it’s a towering peak: 
              running a marathon, changing careers, or even climbing Mount Everest itself. For others, it’s the smaller but just as meaningful 
              climbs: finishing a book you’ve been putting off, cooking at home instead of ordering takeaway, remembering to water your 
              plants, saving for a treat, or keeping up a daily walk. And you’re not limited to just one—you can have as many 
              Everests as you want, big or small. Whatever shape they take, your Everests are the goals that stretch you, test you, 
              and remind you how much you can achieve.
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
              Every mountain is climbed one step at a time. That’s why My Everest
              helps you break your long-term goals into clear, manageable milestones.
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
              no journey is made alone, you can choose to share your Everests publicly on your personal Everests page, connecting
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
              and make your dreams your reality. Your Everests are waiting—are you
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
