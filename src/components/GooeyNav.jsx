import { useRef, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './GooeyNav.css';

const GooeyNav = ({
  items,
  animationTime = 600,
  particleCount = 15,
  particleDistances = [90, 10],
  particleR = 100,
  timeVariance = 300,
  colors = ['#3b82f6', '#6366f1', '#8b5cf6'],
  initialActiveIndex = 0,
}) => {
  const containerRef = useRef(null);
  const navRef = useRef(null);
  const filterRef = useRef(null);
  const textRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  const navigate = useNavigate();

  // Handle click on nav item
  const handleClick = useCallback((e, index) => {
    e.preventDefault();
    const item = items[index];
    setActiveIndex(index);
    
    // Update effect positions
    updateEffectPositions(index);
    
    // Navigate to the target
    if (item.href.startsWith('http')) {
      window.open(item.href, '_blank');
    } else {
      navigate(item.href);
    }
    
    // Create particles
    createParticles(e.target, index);
  }, [items, navigate]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(e, index);
    }
  }, [handleClick]);

  // Update effect positions based on active item
  const updateEffectPositions = useCallback((index) => {
    if (!navRef.current || !filterRef.current || !textRef.current) return;

    const items = navRef.current.querySelectorAll('li');
    const activeItem = items[index];
    if (!activeItem) return;

    const activeLink = activeItem.querySelector('a');
    const rect = activeLink.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    // Position the effect elements
    const x = rect.left - containerRect.left + rect.width / 2;
    const y = rect.top - containerRect.top + rect.height / 2;
    const width = rect.width * 1.2;
    const height = rect.height * 1.2;

    filterRef.current.style.width = `${width}px`;
    filterRef.current.style.height = `${height}px`;
    filterRef.current.style.left = `${x - width / 2}px`;
    filterRef.current.style.top = `${y - height / 2}px`;

    // Set text content and position
    textRef.current.textContent = activeLink.textContent;
    textRef.current.style.width = `${rect.width}px`;
    textRef.current.style.height = `${rect.height}px`;
    textRef.current.style.left = `${x - rect.width / 2}px`;
    textRef.current.style.top = `${y - rect.height / 2}px`;
    textRef.current.style.lineHeight = `${rect.height}px`;

    // Add active class
    filterRef.current.classList.add('active');
    textRef.current.classList.add('active');

    // Remove active class after animation
    setTimeout(() => {
      filterRef.current.classList.remove('active');
      textRef.current.classList.remove('active');
    }, animationTime);
  }, [animationTime]);

  // Create particle effects
  const createParticles = useCallback((target, index) => {
    if (!containerRef.current) return;

    const rect = target.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    
    const x = rect.left - containerRect.left + rect.width / 2;
    const y = rect.top - containerRect.top + rect.height / 2;
    
    const color = colors[index % colors.length];
    const particleCount = 20; // Increased number of particles
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Create more dynamic particle patterns
      const angle = (i / particleCount) * Math.PI * 2;
      const distance = 30 + Math.random() * 50; // Wider spread
      const endX = x + Math.cos(angle) * distance * (0.8 + Math.random() * 0.4);
      const endY = y + Math.sin(angle) * distance * (0.8 + Math.random() * 0.4);
      
      // More varied sizes and timings
      const size = 6 + Math.random() * 6; // Larger particles
      const time = 800 + Math.random() * 400; // Slightly longer duration
      const delay = Math.random() * 200; // Staggered start
      
      // Dynamic properties for more interesting motion
      const midX = x + (endX - x) * (0.3 + Math.random() * 0.2);
      const midY = y + (endY - y) * (0.3 + Math.random() * 0.2);
      
      particle.style.setProperty('--start-x', x);
      particle.style.setProperty('--start-y', y);
      particle.style.setProperty('--mid-x', midX - x);
      particle.style.setProperty('--mid-y', midY - y);
      particle.style.setProperty('--end-x', endX - x);
      particle.style.setProperty('--end-y', endY - y);
      particle.style.setProperty('--rotate', `${Math.random() * 360}deg`);
      particle.style.setProperty('--scale', 0.8 + Math.random() * 0.7);
      particle.style.setProperty('--time', `${time}ms`);
      particle.style.setProperty('--delay', `${delay}ms`);
      
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.background = color;
      particle.style.animationDuration = `${time}ms`;
      particle.style.animationDelay = `${delay}ms`;
      particle.style.opacity = '0.9';
      particle.style.boxShadow = `0 0 ${size * 2}px ${size}px ${color}40`;
      
      containerRef.current.appendChild(particle);
      
      // Remove particle after animation
      setTimeout(() => {
        if (particle && particle.parentNode) {
          particle.remove();
        }
      }, time + delay + 100);
    }
  }, [animationTime, colors, particleCount, particleDistances, timeVariance]);

  // Initialize effect positions on mount and when activeIndex changes
  useEffect(() => {
    updateEffectPositions(activeIndex);
    
    // Update on window resize
    const handleResize = () => updateEffectPositions(activeIndex);
    window.addEventListener('resize', handleResize);
    
    // Force update positions after a short delay to ensure DOM is ready
    const timer = setTimeout(() => {
      updateEffectPositions(activeIndex);
    }, 100);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [activeIndex, updateEffectPositions]);

  return (
    <div className="gooey-nav-container" ref={containerRef}>
      <nav>
        <ul ref={navRef} className="flex space-x-4">
          {items.map((item, index) => (
            <li
              key={index}
              className={`relative rounded-full px-6 py-2 transition-all duration-300 ${
                activeIndex === index ? 'text-blue-600 bg-white' : 'text-white hover:bg-white/20'
              }`}
            >
              <a
                href={item.href}
                onClick={(e) => handleClick(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="relative z-30 font-medium block transition-colors duration-300"
                style={{ color: activeIndex === index ? '#3b82f6' : 'white' }}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <span className="effect filter" ref={filterRef} />
      <span className="effect text" ref={textRef} />
    </div>
  );
};

export default GooeyNav;
