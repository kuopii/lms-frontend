import FooterComp from "@/components/footer/FooterComp";
import Container from "./banner/Container";
import ContentComp from "./content/ContentComp";

const HomeComp = () => {
  return (
    <div>
      <Container />
      <ContentComp />
      <FooterComp />
    </div>
  );
};

export default HomeComp;
