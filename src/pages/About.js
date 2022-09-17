const About = () => {
  return (
    <main>
      <h1>Abstract</h1>
      <p>
        The project explores the viability of crowd sourcing measurements to map
        out areas of high turbulence on domestic flight routes in Iceland.
        Initial viability of measuring vertical acceleration was established in
        the report preceding this one (ISSN 2772-1078). The objective of the
        project described in this report is to carry on where the previous
        project left off, and establish a method to transport data from the
        measuring smartphone and into a long term storage solution that can then
        be accessed later for further exploration and processing.
      </p>
      <p>
        Data communication is provided by a protocol called MQTT. Any smartphone
        that has measurements to share can publish them to the MQTT broker which
        then delegates these dataframes to subscriber processes that can do any
        required postprocessing such as de- compression, error correction or
        even adding weather data. Once the subscriber is done with
        postprocessing, measurements can be bulk inserted into a database that
        can be made accessible by providing a user facing API.
      </p>
    </main>
  );
};

export default About;
