import Container from "./banner/Container";
import ContentComp from "./content/ContentComp";
import Footer from "@/components/container/footer";

const HomeComp = () => {
  return (
    <div>
      <Container />
      <ContentComp />
      <Footer />
    </div>
  );
};

export default HomeComp;
