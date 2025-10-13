import { motion } from "framer-motion"

const TestimonialCard = ({icon: Icon, title, comment, name}) => {
return (
       <motion.div 
       initial={{ opacity: 0, y: 50  }}
       whileInView={{ opacity: 1, y: 0, transition: { duration: 0.5, ease:"easeIn" } }}
       className="lg:w-1/3 lg:mb-0 mb-6 p-4">
        <div className="h-full text-start bg-white/10 rounded-2xl p-5">
          {/* <img alt="testimonial" className="w-20 h-20 mb-8 object-cover object-center rounded-full inline-block border-2 border-gray-200 bg-gray-100" src="https://dummyimage.com/302x302"/> */}
          {/* <span className="text-sky-500"><Icon/></span> */}
          <div className="flex flex-row mb-4">
             {[...Array(5)].map((_, i) => (
                    <span className="text-sky-400" key={i}><Icon /></span>
                ))}
          </div>
          <h2 className="leading-relaxed text-xl font-semibold">"{title}".</h2>
          <span className="inline-block h-1 w-10 rounded bg-green-500 mt-6 mb-4"></span>
          <p className="text-gray-300 text-lg tracking-tight ">{comment}</p>
          <p className="text-gray-400 font-medium title-font tracking-wider text-sm">- {name}</p>
        </div>
      </motion.div>
)
}

export default TestimonialCard
