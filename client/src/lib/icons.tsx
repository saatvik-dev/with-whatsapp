import { 
  CheckCircle2, 
  Shield, 
  Medal, 
  Lightbulb, 
  Leaf, 
  Wrench, 
  Award, 
  Droplet, 
  Flame, 
  Wind, 
  Bug, 
  Recycle, 
  Infinity, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Check, 
  X, 
  AlertTriangle, 
  ArrowRight, 
  Box, 
  Send,
  Menu,
  X as XIcon
} from 'lucide-react';

// Create wrapper components to match the styling from Font Awesome
export const IconCheck = (props: any) => <CheckCircle2 size={props.size || 20} {...props} />;
export const IconShield = (props: any) => <Shield size={props.size || 20} {...props} />;
export const IconMedal = (props: any) => <Medal size={props.size || 20} {...props} />;
export const IconLightbulb = (props: any) => <Lightbulb size={props.size || 20} {...props} />;
export const IconLeaf = (props: any) => <Leaf size={props.size || 20} {...props} />;
export const IconTool = (props: any) => <Wrench size={props.size || 20} {...props} />;
export const IconAward = (props: any) => <Award size={props.size || 20} {...props} />;
export const IconWater = (props: any) => <Droplet size={props.size || 20} {...props} />;
export const IconFire = (props: any) => <Flame size={props.size || 20} {...props} />;
export const IconWind = (props: any) => <Wind size={props.size || 20} {...props} />;
export const IconBug = (props: any) => <Bug size={props.size || 20} {...props} />;
export const IconRecycle = (props: any) => <Recycle size={props.size || 20} {...props} />;
export const IconInfinity = (props: any) => <Infinity size={props.size || 20} {...props} />;
export const IconMapPin = (props: any) => <MapPin size={props.size || 20} {...props} />;
export const IconPhone = (props: any) => <Phone size={props.size || 20} {...props} />;
export const IconMail = (props: any) => <Mail size={props.size || 20} {...props} />;
export const IconClock = (props: any) => <Clock size={props.size || 20} {...props} />;
export const IconFacebook = (props: any) => <Facebook size={props.size || 20} {...props} />;
export const IconInstagram = (props: any) => <Instagram size={props.size || 20} {...props} />;
export const IconTwitter = (props: any) => <Twitter size={props.size || 20} {...props} />;
export const IconLinkedin = (props: any) => <Linkedin size={props.size || 20} {...props} />;
export const IconArrowRight = (props: any) => <ArrowRight size={props.size || 20} {...props} />;
export const IconCube = (props: any) => <Box size={props.size || 20} {...props} />;
export const IconMenu = (props: any) => <Menu size={props.size || 20} {...props} />;
export const IconX = (props: any) => <XIcon size={props.size || 20} {...props} />;
export const IconSend = (props: any) => <Send size={props.size || 20} {...props} />;
export const IconWhatsApp = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={props.size || 24} height={props.size || 24} {...props}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

// Icons for comparison table
export const IconSuccess = (props: any) => <Check className="text-teal-600" size={props.size || 20} {...props} />;
export const IconFail = (props: any) => <X className="text-red-500" size={props.size || 20} {...props} />;
export const IconWarning = (props: any) => <AlertTriangle className="text-yellow-500" size={props.size || 20} {...props} />;
