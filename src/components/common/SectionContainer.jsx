export const Container = ({ children, className = "" }) => {
  return <div className={`container ${className}`}>{children}</div>;
};

// Basic Section for vertical spacing / section styling
export const Section = ({ children, className = "", as: Component = "section" }) => {
  return <Component className={`section ${className}`}>{children}</Component>;
};

const SectionContainer = ({ children, className = "" }) => (
  <Container>
    <Section className={className}>{children}</Section>
  </Container>
);


export default SectionContainer;
