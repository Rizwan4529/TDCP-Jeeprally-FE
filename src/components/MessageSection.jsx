import SectionContainer from "./common/SectionContainer"

const MessageSection = ({
  title,
  message,
  author,
  designation,
  image,
  reverse = false,
}) => {
  return (
    <SectionContainer>
      <div
        className={`relative flex g-md md:gap-0 bg-section rounded-lg md:max-w-[95%] ${
          reverse
            ? "md:flex-row-reverse flex-col mr-auto p-4 md:pl-18"
            : "flex-col md:flex-row ml-auto p-4 md:pr-18"
        }`}
      >
        {/* Image */}
        <div className='relative md:w-[405px] md:h-[494px] flex-shrink-0'>
          <img
            src={image}
            alt={author || "Person"}
            className={`rounded-lg
              h-[300px] max-h-[300px]
              md:h-[500px] md:max-h-[500px] w-full object-cover
              md:absolute md:bottom-0 md:translate-y-[10%] 
              ${reverse ? "md:translate-x-[20%]" : "md:-translate-x-[20%]"}
            `}
          />
        </div>

        {/* Content */}
        <div className='flex-1 flex flex-col justify-center g-md'>
          <h2 className='heading font-gilda'>{title}</h2>
          <p className='para text-muted'>{message}</p>

          <div className='spacing-y-sm'>
            <p className='para text-muted'>{author}</p>
            {/* <p className='para text-muted'>{designation}</p> */}
          </div>
        </div>
      </div>
    </SectionContainer>
  )
}

export default MessageSection
