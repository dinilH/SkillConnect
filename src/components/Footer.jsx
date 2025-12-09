export default function Footer() {
  return (
    <footer
      className="
        fixed left-0 bottom-0 w-full z-40
        bg-linear-to-r from-[#7D4DF4] to-[#A589FD]
        text-white
        py-6 px-6
      "
      role="contentinfo"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Column 1 */}
        <div>
          <h2 className="text-2xl font-semibold">SkillLink</h2>
          <p className="mt-2 text-gray-100 text-sm leading-relaxed">
            A platform for students to connect, learn, and grow together.
          </p>
        </div>

        {/* Column 2 */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-100 text-sm">
            <li className="hover:text-white transition cursor-pointer">Home</li>
            <li className="hover:text-white transition cursor-pointer">Skill Search</li>
            <li className="hover:text-white transition cursor-pointer">Skill Request</li>
            <li className="hover:text-white transition cursor-pointer">Community</li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
          <p className="text-gray-100 text-sm">University of Sri Jayawardenepura</p>
          <p className="text-gray-100 text-sm">Faculty of Technology</p>
          <p className="text-gray-100 text-sm mt-2">support@skilllink.edu</p>
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-6xl mx-auto mt-8 border-t border-white/30"></div>

      {/* Bottom note */}
      <p className="text-center text-gray-200 text-xs mt-6">
        © {new Date().getFullYear()} SkillLink — All Rights Reserved.
      </p>
    </footer>
  );
}
