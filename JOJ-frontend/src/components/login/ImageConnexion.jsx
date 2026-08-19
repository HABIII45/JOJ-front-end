import imageConnexion from "../../assets/images/image connexion.svg";

function ImageConnexion() {
  return (
    <section className="relative min-h-screen w-[42.5%] overflow-hidden">
      <img
        src={imageConnexion}
        alt=""
        className="absolute h-full object-cover"
        style={{ left: 0, right: "40px" }}
      />
    </section>
  );
}

export default ImageConnexion;
