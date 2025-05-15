import { useEffect, useState } from 'react';

const images = [
  'http://localhost:1337/uploads/Jason_and_Lucia_01_ultrawide_be221034df.jpg',
  'http://localhost:1337/uploads/Jason_and_Lucia_02_ultrawide_956d0dceb6.jpg',
  'http://localhost:1337/uploads/Jason_and_Lucia_Motel_ultrawide_358e02e36a.jpg',
];

const targetDate = new Date('2026-05-26T00:00:00');

export default function Banner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const countdown = setInterval(() => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(countdown);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  return (
    <section className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] w-full overflow-hidden ">
      {/* Imagenes en capas */}
      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          alt={`Slide ${index}`}
          className={`absolute inset-0 w-full h-full object-fill transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        />
      ))}

      {/* Capa de fondo oscura y contenido */}
      <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white px-4 text-center z-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-md">Tiempo restante</h1>

        <div className="bg-white bg-opacity-10 backdrop-blur-md px-6 py-4 rounded-lg shadow-lg">
          <div className="text-4xl font-mono font-bold text-white drop-shadow-lg tracking-wide">
            {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
          </div>
        </div>

        <div className="text-sm mt-4 text-white drop-shadow-sm">26 de mayo del 2026</div>
      </div>
    </section>
  );
}
