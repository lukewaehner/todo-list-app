export default function Home() {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <a
        href="/dashboard"
        className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl text-platinum uppercase font-bold text-5xl text-center text-slategray-100 hover:scale-125 transition-transform duration-300  hover:text-richblack-300 hover:text-shadow-md "
        style={{ textOutline: "2px 2px 0 #333" }}
      >
        Todo List App
      </a>
    </div>
  );
}
