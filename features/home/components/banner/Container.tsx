import Banner from "./Banner";

const Container = () => {
  return (
    <div className="flex h-screen w-full justify-center">
      {/* xl:px-[122px] */}
      <div className="px-4 pt-[100px] md:px-[50px] md:pt-[150px] lg:pt-[263px] xl:w-[1350px]">
        <Banner />
      </div>
    </div>
  );
};

export default Container;
