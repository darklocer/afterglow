import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-200 select-none disabled:cursor-not-allowed disabled:opacity-45';

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-[15px]',
  lg: 'px-8 py-4 text-base',
};

const variants = {
  // burgundy with a hairline of gold
  primary: 'bg-wine text-cream shadow-[inset_0_0_0_1px_rgba(201,169,110,.55)] hover:bg-burgundy',
  secondary: 'bg-transparent text-wine border border-wine/30 hover:border-wine hover:bg-wine/5',
  light: 'bg-cream text-wine hover:bg-ivory shadow-[inset_0_0_0_1px_rgba(201,169,110,.7)]',
  ghostLight: 'bg-transparent text-cream border border-cream/30 hover:border-cream/70 hover:bg-cream/5',
  danger: 'bg-transparent text-burgundy border border-burgundy/30 hover:bg-burgundy/5',
};

const MotionLink = motion.create(Link);

export default function Button({ to, href, variant = 'primary', size = 'md', className = '', children, ...rest }) {
  const cls = `${base} ${sizes[size]} ${variants[variant]} ${className}`;
  const hover = { y: -2 };
  const tap = { y: 0, scale: 0.98 };
  if (to) {
    return (
      <MotionLink to={to} className={cls} whileHover={hover} whileTap={tap} {...rest}>
        {children}
      </MotionLink>
    );
  }
  if (href) {
    return (
      <motion.a href={href} className={cls} whileHover={hover} whileTap={tap} {...rest}>
        {children}
      </motion.a>
    );
  }
  return (
    <motion.button className={cls} whileHover={rest.disabled ? undefined : hover} whileTap={rest.disabled ? undefined : tap} {...rest}>
      {children}
    </motion.button>
  );
}
