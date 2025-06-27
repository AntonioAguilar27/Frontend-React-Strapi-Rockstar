import Banner from "../components/Banner";
import PlataformasGrid from "../components/PlataformasGrid";
export default function Landing() {
  return (
    <main
      style={{
        backgroundImage:
          "url('http://localhost:1337/uploads/background_image_325d67b3eb.png')",
      }}
    >
      <Banner />
      <PlataformasGrid />
      <section></section>
    </main>
  );
}
