export interface containers{
  containers: container[];
}

export interface container{
  set: set;
}

export interface set{
  items: items[];

  meta: {
    hits: number;
    page_size: number;
  }

  text: {
    title: {
      full: {
        set: {
          default: {
            content: string;
            language: string;
          };
        };
      };
    };
  };
}

export interface items {
  contentId: string;
  image: {
    //Modal Image
    hero_tile: {
        "3.00": {
            program: {
                default: {
                    url: string;
                };
            };
            series: {
                default: {
                    url: string;
                };
            };
        };
    };
    background: {
        "1.78": {
            series: {
                default: {
                    url: string;
                };
            };
            program: {
                default: {
                    url: string;
                };
            };
        };
    };
    background_details: {
        "1.78": {
            series: {
                default: {
                    url: string;
                };
            };
        };
    };
    //Card image
    tile: {
      "1.78": {
        series: {
          default: {
            url: string;
            masterId: string;
            masterWidth: number;
            masterHeight: number;
          };
        };
        program: {
          default: {
            url: string;
            masterId: string;
            masterWidth: number;
            masterHeight: number;
          };
        };
        default: {
          default: {
            url: string;
            masterId: string;
            masterWidth: number;
            masterHeight: number;
          };
        };
      };
    };

  };

  //Title details
  text: {
    title: {
      full: {
        series: {
          default: {
            content: string;
            language: string;
          };
        };
        program: {
            default: {
                content: string;
                language: string;
            };
        };
        collection: {
            default: {
                content: string;
                language: string;
            };
        };
      };
    };
  };

  ratings: {
    advisories: [];
    descriptions: string;
    system: string;
    value: string;
  }[];

  releases: {
    releaseDate: string;
    releaseType: string;
    releaseYear: number;
  }[];

  type: string;

  videoArt: {
    mediaMetadata: {
      urls: {
        url: string;
      }[];
    }
  }[];
}