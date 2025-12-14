export default function Hero() {
  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="w-full bg-linear-to-br from-[#7D4DF4] to-[#A589FD] text-white py-20">
        <div className="w-full flex flex-col items-center px-6">

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-center leading-tight">
            Find Skilled Students Inside Your University
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-lg md:text-xl text-center max-w-2xl opacity-90">
            Search for designers, developers, tutors, editors, mentors — connect and collaborate instantly.
          </p>

          {/* Search Bar */}
          <div className="mt-10 w-full max-w-xl">
            <div className="flex items-center bg-white rounded-2xl shadow-xl overflow-hidden">
              <input
                type="text"
                placeholder="Search for a skill (ex: Web Development, UI/UX, Java)"
                className="w-full px-4 py-3 text-gray-700 outline-none"
              />
              <button className="bg-[#7D4DF4] text-white px-6 py-3 font-semibold hover:bg-[#6A3DE0] transition">
                Search
              </button>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
