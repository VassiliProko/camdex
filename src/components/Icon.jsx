// Google Material Symbols (outlined) wrapped with the same names/props the app used before.
const make = (glyph) =>
  function Icon({ size = 20, fill, className = '', ...rest }) {
    return (
      <span
        className={`mi ${fill && fill !== 'none' ? 'filled' : ''} ${className}`}
        style={{ fontSize: size }}
        aria-hidden="true"
        {...rest}
      >
        {glyph}
      </span>
    );
  };

export const Camera = make('photo_camera');
export const Heart = make('favorite');
export const User = make('person');
export const ArrowLeft = make('arrow_back');
export const ArrowRight = make('arrow_forward');
export const HelpCircle = make('help');
export const X = make('close');
export const Columns = make('compare');
export const Check = make('check');
export const Compass = make('explore');
export const Sliders = make('tune');
export const Edit2 = make('edit');
export const Plus = make('add');
export const Minus = make('remove');
export const Save = make('bookmark');
export const RefreshCw = make('refresh');
export const ExternalLink = make('open_in_new');
export const Upload = make('upload');
export const BookOpen = make('menu_book');
export const Award = make('workspace_premium');
export const ChevronDown = make('expand_more');
export const Search = make('search');
