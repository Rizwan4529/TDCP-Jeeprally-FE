import { LOCATION_ICON } from "../assets"

const Card = ({ image, name, location, date, desc }) => {
  return (
    <div className='bg-section rounded-lg shadow-md p-4 relative spacing-y-sm'>
      <img
        src={image}
        alt={name}
        className='w-full h-[225px] md:h-[250px] rounded-lg object-cover'
      />

      <p className='absolute top-6 left-0 bg-secondary text-black text-sm font-medium px-3 py-1'>{date}</p>

      <div className='spacing-y-sm px-1'>
        <h3 className='heading-20 font-gilda truncate'>{name}</h3>

        <p className='text-sm text-muted flex items-center gap-px'>
          <LOCATION_ICON className='icon text-primary shrink-0' />
          <span className='truncate'>{location}</span>
        </p>

        <p className='text-sm text-muted line-clamp-2'>{desc}</p>

        <div
          className='relative inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-all duration-300 text-sm cursor-pointer group'
        >
          <span className='relative'>
            View Details
            <span className='absolute left-0 -bottom-0.5 h-[2px] w-full bg-current scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left'></span>
          </span>
        </div>
      </div>
    </div>
  )
}

export default Card
