import Carousel from 'react-bootstrap/Carousel';

//Carousel from bootstrap for start-screen
function UncontrolledExample() {
  return (
    <Carousel>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="/assets/1.png"
          alt="Eggcelent Eggs"
        />
        <Carousel.Caption>
          <h3>Eggcelent Tiny Eggs</h3>
          <p>Two tiny eggs and nothing more. Of course it fits right in</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="/assets/2.png"
          alt="Tiny Turkey with Beans"
        />
        <Carousel.Caption>
          <h3>Tiny Turkey Fiesta</h3>
          <p>Thanksgiving combo. Served with complementary Tiny Beans that look like Turkey Turds</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="/assets/3.png"
          alt="Tiny Cake"
        />
        <Carousel.Caption>
          <h3>Piece Of Cake</h3>
          <p>
            Tiny Cake - Tiny Regrets, only 2 Calories!
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default UncontrolledExample;