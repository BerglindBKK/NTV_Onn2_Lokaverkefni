import Carousel from 'react-bootstrap/Carousel';
import Image from 'next/image';
// import ExampleCarouselImage from 'components/ExampleCarouselImage';
// import firstImage from './assets/1.png';
// import secondImage from './assets/2.png';
// import thirdImage from './assets/3.png';

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
          <title>Eggcelent Tiny Eggs</title>
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
          <title>Tiny Turkey Fiesta</title>
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
          <title>Piece Of Cake</title>
          <p>
            Tiny Cake - Tiny Regrets, only 2 Calories!
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default UncontrolledExample;