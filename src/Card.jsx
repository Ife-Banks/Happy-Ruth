import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { Typewriter } from 'react-simple-typewriter';
import { motion } from 'framer-motion';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './card.css';

import cardImage from "../public/Ruth.jpg";

const CardSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 2;
  const [isMobile, setIsMobile] = useState(false);
  

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);



  // Reset typing when leaving second slide
  

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const pyroVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "backOut"
      }
    }
  };

  return (
    <motion.div 
      className="wrapper"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={isMobile ? 20 : 40}
        slidesPerView={1}
        centeredSlides={true}
        speed={500}
        loop={true}
        grabCursor={true}
        navigation={!isMobile}
        pagination={{
          type: 'fraction',
          el: '.swiper-pagination',
          clickable: true,
        }}
        touchRatio={0.5}
        touchAngle={45}
        shortSwipes={false}
        longSwipes={true}
        threshold={15}
        followFinger={true}
        resistance={true}
        resistanceRatio={0.4}
        touchStartPreventDefault={!isMobile}
        edgeSwipeDetection={isMobile}
        edgeSwipeThreshold={20}
        onSlideChange={(swiper) => {
          setCurrentSlide(swiper.realIndex);
        }}
        onInit={(swiper) => setCurrentSlide(swiper.realIndex)}
      >
        {/* First Slide */}
 <SwiperSlide className="bg">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="pyro left">
              <div className="before"></div>
              <div className="after"></div>
            </div>
            <div className="pyro center">
              <div className="before"></div>
              <div className="after"></div>
            </div>
            <div className="pyro right">
              <div className="before"></div>
              <div className="after"></div>
            </div>
            
            <motion.section 
              className="section"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="container">
                <div className="row">
                  <div className="col-sm-10 col-md-10 mauto">
                    <motion.div 
                      className="img-container"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <div className="imgset">
                        <motion.img 
                          width="100%" 
                          height="" 
                          src={cardImage} 
                          alt="Card"
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.4, duration: 0.6 }}
                        />
                      </div>
                      <div className="card text-center">
                        <div className="position-relative progress-wrapper">
                          <motion.div 
                            className="wave" 
                            data-progress="90%"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.section>
          </motion.div>
        </SwiperSlide>
        {/* Second Slide with Typewriter */}
        <SwiperSlide className='bg border border-blue-300'>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="pyro left">
              <div className="before"></div>
              <div className="after"></div>
            </div>
            <div className="pyro center">
              <div className="before"></div>
              <div className="after"></div>
            </div>
            <div className="pyro right">
              <div className="before"></div>
              <div className="after"></div>
            </div>
            
            <motion.div
      className="p-4 ptext-lg md:text-xl font-medium leading-relaxed text-center p-text"
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
      whileHover={{ scale: 1.01 }}
      style={{ whiteSpace: "pre-wrap" }}
    >
      <Typewriter
        words={[
          `My dear Oluwaferanmi 😌

I tell you almost all the time that your name is a reminder of how much God loves me, that is why I love to call your name in full, "Oluwaferanmi"

You're a gift from God, my God given friend, the bond I share with you, I can't help it.

I pray that this new year is full of God's goodness. I pray that our friendship grows stronger, I pray that you find light, I pray strength into you and the love of God into your soul 

You are a blessing to this generation. I can't wait to see you at the top, to cheer for you and scream your name, to celebrate your every win.

I love you. Have a blissful year 🎉❤`
        ]}
        typeSpeed={55}
        deleteSpeed={0} // prevents any backspacing
        delaySpeed={1000}
        cursor
        cursorStyle="|"
      />
    </motion.div>
          </motion.div>
        </SwiperSlide>
      </Swiper>
      
      <motion.div 
        className="swiper-pagination"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      />
    </motion.div>
  );
};

export default CardSlider;