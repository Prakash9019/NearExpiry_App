import { Leaf, Heart, Shield } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-primary text-white mt-20">
      <div className="max-w-container px-2 py-12">
        <div className="grid grid-3 mb-8">
          <div>
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
              <Leaf size={20} /> Sustainability
            </h3>
            <p className="text-neutral-300">Every purchase saves the planet from waste.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
              <Heart size={20} /> Savings
            </h3>
            <p className="text-neutral-300">Save up to 70% on household essentials.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
              <Shield size={20} /> Trust
            </h3>
            <p className="text-neutral-300">Verified sellers & quality guaranteed.</p>
          </div>
        </div>

        <div className="border-t border-neutral-700 pt-8">
          <div className="grid grid-3 gap-6 mb-8">
            <div>
              <h4 className="font-bold mb-3">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-neutral-300 hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral-300 hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral-300 hover:text-white">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3">Support</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-neutral-300 hover:text-white">
                    Help
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral-300 hover:text-white">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral-300 hover:text-white">
                    FAQs
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-neutral-300 hover:text-white">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral-300 hover:text-white">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral-300 hover:text-white">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center text-neutral-400 pt-8 border-t border-neutral-700">
            <p>&copy; 2025 NearExpiry. Save money, save the planet.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
