import { DefaultTheme } from 'styled-components';

export interface ThemeType {
  colors: {
    primary: string;
    secondary: string;
    tertiary: string;
    background: {
      primary: string;
      secondary: string;
      tertiary: string;
    };
    surface: {
      default: string;
      elevated: string;
      muted: string;
      hover: string;
      active: string;
    };
    text: {
      primary: string;
      secondary: string;
      tertiary: string;
      muted: string;
      inverse: string;
    };
    border: string;
    accent: {
      primary: string;
      secondary: string;
      muted: string;
      hover: string;
      border: string;
    };
    status: {
      success: {
        primary: string;
        muted: string;
        border: string;
      };
      warning: {
        primary: string;
        muted: string;
        border: string;
      };
      error: {
        primary: string;
        muted: string;
        border: string;
      };
      info: {
        primary: string;
        muted: string;
        border: string;
      };
    };
  };
  typography: {
    fontFamily: string;
    h1: {
      fontSize: string;
      fontWeight: number;
    };
    h2: {
      fontSize: string;
      fontWeight: number;
    };
    h3: {
      fontSize: string;
      fontWeight: number;
    };
    h4: {
      fontSize: string;
      fontWeight: number;
    };
    h5: {
      fontSize: string;
      fontWeight: number;
    };
    h6: {
      fontSize: string;
      fontWeight: number;
    };
    body1: {
      fontSize: string;
      fontWeight: number;
    };
    body2: {
      fontSize: string;
      fontWeight: number;
    };
    caption: {
      fontSize: string;
      fontWeight: number;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  radius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

export const darkTheme: DefaultTheme & ThemeType = {
  colors: {
    primary: '#007acc',
    secondary: '#64b5f6',
    tertiary: '#bbdefb',
    background: {
      primary: '#1a1a2e',
      secondary: '#16213e',
      tertiary: '#0f3460',
    },
    surface: {
      default: '#1e293b',
      elevated: '#253347',
      muted: 'rgba(255, 255, 255, 0.05)',
      hover: 'rgba(255, 255, 255, 0.08)',
      active: 'rgba(255, 255, 255, 0.1)',
    },
    text: {
      primary: '#ffffff',
      secondary: '#e2e8f0',
      tertiary: '#94a3b8',
      muted: '#64748b',
      inverse: '#000000',
    },
    border: 'rgba(255, 255, 255, 0.1)',
    accent: {
      primary: '#007acc',
      secondary: '#64b5f6',
      muted: 'rgba(0, 122, 204, 0.2)',
      hover: 'rgba(0, 122, 204, 0.3)',
      border: 'rgba(0, 122, 204, 0.5)',
    },
    status: {
      success: {
        primary: '#22c55e',
        muted: 'rgba(34, 197, 94, 0.2)',
        border: 'rgba(34, 197, 94, 0.5)',
      },
      warning: {
        primary: '#f59e0b',
        muted: 'rgba(245, 158, 11, 0.2)',
        border: 'rgba(245, 158, 11, 0.5)',
      },
      error: {
        primary: '#ef4444',
        muted: 'rgba(239, 68, 68, 0.2)',
        border: 'rgba(239, 68, 68, 0.5)',
      },
      info: {
        primary: '#3b82f6',
        muted: 'rgba(59, 130, 246, 0.2)',
        border: 'rgba(59, 130, 246, 0.5)',
      },
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "SF Pro Display", Roboto, -apple-system, BlinkMacSystemFont, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
    },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  radius: {
    sm: '2px',
    md: '4px',
    lg: '8px',
    xl: '12px',
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.1)',
  },
};

export const lightTheme: DefaultTheme & ThemeType = {
  colors: {
    primary: '#007acc',
    secondary: '#64b5f6',
    tertiary: '#bbdefb',
    background: {
      primary: '#ffffff',
      secondary: '#f8fafc',
      tertiary: '#e2e8f0',
    },
    surface: {
      default: '#ffffff',
      elevated: '#ffffff',
      muted: 'rgba(0, 0, 0, 0.05)',
      hover: 'rgba(0, 0, 0, 0.08)',
      active: 'rgba(0, 0, 0, 0.1)',
    },
    text: {
      primary: '#1e293b',
      secondary: '#334155',
      tertiary: '#64748b',
      muted: '#94a3b8',
      inverse: '#ffffff',
    },
    border: 'rgba(0, 0, 0, 0.1)',
    accent: {
      primary: '#007acc',
      secondary: '#64b5f6',
      muted: 'rgba(0, 122, 204, 0.1)',
      hover: 'rgba(0, 122, 204, 0.15)',
      border: 'rgba(0, 122, 204, 0.3)',
    },
    status: {
      success: {
        primary: '#22c55e',
        muted: 'rgba(34, 197, 94, 0.1)',
        border: 'rgba(34, 197, 94, 0.3)',
      },
      warning: {
        primary: '#f59e0b',
        muted: 'rgba(245, 158, 11, 0.1)',
        border: 'rgba(245, 158, 11, 0.3)',
      },
      error: {
        primary: '#ef4444',
        muted: 'rgba(239, 68, 68, 0.1)',
        border: 'rgba(239, 68, 68, 0.3)',
      },
      info: {
        primary: '#3b82f6',
        muted: 'rgba(59, 130, 246, 0.1)',
        border: 'rgba(59, 130, 246, 0.3)',
      },
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "SF Pro Display", Roboto, -apple-system, BlinkMacSystemFont, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
    },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  radius: {
    sm: '2px',
    md: '4px',
    lg: '8px',
    xl: '12px',
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.15)',
  },
};

export default darkTheme;