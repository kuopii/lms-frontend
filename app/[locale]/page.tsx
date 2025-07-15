import HomeComp from "@/features/home/components/HomeComp";

export default function Home() {
  return (
    <div
      className="h-screen bg-black bg-[length:1100px_auto,300px_auto] bg-[position:right_top,left_bottom] bg-no-repeat"
      style={{
        backgroundImage: "url('/home/Vector.png'), url('/home/Vector2.png')",
      }}
    >
      <div>
        <HomeComp />
      </div>
    </div>
  );
}
