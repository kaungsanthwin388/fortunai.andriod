// Bazi Calculator Module
// This module provides functionality for calculating Chinese BaZi (Four Pillars)

interface BaziResult {
    yearPillar: {
      heavenlyStem: string;
      earthlyBranch: string;
    };
    monthPillar: {
      heavenlyStem: string;
      earthlyBranch: string;
    };
    dayPillar: {
      heavenlyStem: string;
      earthlyBranch: string;
    };
    hourPillar: {
      heavenlyStem: string;
      earthlyBranch: string;
    };
  }
  
  interface BaziAnalysis {
    elements: {
      dominant: string;
      weak: string;
      all: string[];
    };
    animals: {
      dominant: string;
      weak: string;
      all: string[];
    };
    personality: string[];
    compatibility: string[];
    lucky: {
      colors: string[];
      numbers: number[];
      directions: string[];
    };
    challenges: string[];
    opportunities: string[];
  }
  
  export class BaziCalculator {
    private heavenlyStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    private earthlyBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    private birthDate: Date;
    private gender: 'male' | 'female';
  
    constructor(date: Date, gender: 'male' | 'female' = 'male') {
      this.birthDate = date;
      this.gender = gender;
    }
  
    calculateBazi(date: Date = this.birthDate): BaziResult {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hour = date.getHours();
  
      // Calculate Year Pillar
      const yearStem = this.heavenlyStems[(year - 4) % 10];
      const yearBranch = this.earthlyBranches[(year - 4) % 12];
  
      // Calculate Month Pillar
      const monthStem = this.heavenlyStems[(month + 2) % 10];
      const monthBranch = this.earthlyBranches[(month + 2) % 12];
  
      // Calculate Day Pillar
      const dayStem = this.heavenlyStems[(day - 1) % 10];
      const dayBranch = this.earthlyBranches[(day - 1) % 12];
  
      // Calculate Hour Pillar
      const hourStem = this.heavenlyStems[(hour / 2) % 10];
      const hourBranch = this.earthlyBranches[(hour / 2) % 12];
  
      return {
        yearPillar: {
          heavenlyStem: yearStem,
          earthlyBranch: yearBranch
        },
        monthPillar: {
          heavenlyStem: monthStem,
          earthlyBranch: monthBranch
        },
        dayPillar: {
          heavenlyStem: dayStem,
          earthlyBranch: dayBranch
        },
        hourPillar: {
          heavenlyStem: hourStem,
          earthlyBranch: hourBranch
        }
      };
    }
  
    getElement(heavenlyStem: string): string {
      const elementMap: { [key: string]: string } = {
        '甲': 'Wood',
        '乙': 'Wood',
        '丙': 'Fire',
        '丁': 'Fire',
        '戊': 'Earth',
        '己': 'Earth',
        '庚': 'Metal',
        '辛': 'Metal',
        '壬': 'Water',
        '癸': 'Water'
      };
      return elementMap[heavenlyStem] || 'Unknown';
    }
  
    getAnimal(earthlyBranch: string): string {
      const animalMap: { [key: string]: string } = {
        '子': 'Rat',
        '丑': 'Ox',
        '寅': 'Tiger',
        '卯': 'Rabbit',
        '辰': 'Dragon',
        '巳': 'Snake',
        '午': 'Horse',
        '未': 'Goat',
        '申': 'Monkey',
        '酉': 'Rooster',
        '戌': 'Dog',
        '亥': 'Pig'
      };
      return animalMap[earthlyBranch] || 'Unknown';
    }
  
    getLuckyElements(bazi: BaziResult): string[] {
      const elements = new Set<string>();
      
      // Add elements from all pillars
      elements.add(this.getElement(bazi.yearPillar.heavenlyStem));
      elements.add(this.getElement(bazi.monthPillar.heavenlyStem));
      elements.add(this.getElement(bazi.dayPillar.heavenlyStem));
      elements.add(this.getElement(bazi.hourPillar.heavenlyStem));
  
      return Array.from(elements);
    }
  
    getLuckyAnimals(bazi: BaziResult): string[] {
      const animals = new Set<string>();
      
      // Add animals from all pillars
      animals.add(this.getAnimal(bazi.yearPillar.earthlyBranch));
      animals.add(this.getAnimal(bazi.monthPillar.earthlyBranch));
      animals.add(this.getAnimal(bazi.dayPillar.earthlyBranch));
      animals.add(this.getAnimal(bazi.hourPillar.earthlyBranch));
  
      return Array.from(animals);
    }
  
    getCompleteAnalysis(bazi: BaziResult): BaziAnalysis {
      const elements = this.getLuckyElements(bazi);
      const animals = this.getLuckyAnimals(bazi);
  
      // Count element occurrences
      const elementCounts = new Map<string, number>();
      elements.forEach(element => {
        elementCounts.set(element, (elementCounts.get(element) || 0) + 1);
      });
  
      // Find dominant and weak elements
      let dominantElement = '';
      let weakElement = '';
      let maxCount = 0;
      let minCount = Infinity;
  
      elementCounts.forEach((count, element) => {
        if (count > maxCount) {
          maxCount = count;
          dominantElement = element;
        }
        if (count < minCount) {
          minCount = count;
          weakElement = element;
        }
      });
  
      // Count animal occurrences
      const animalCounts = new Map<string, number>();
      animals.forEach(animal => {
        animalCounts.set(animal, (animalCounts.get(animal) || 0) + 1);
      });
  
      // Find dominant and weak animals
      let dominantAnimal = '';
      let weakAnimal = '';
      maxCount = 0;
      minCount = Infinity;
  
      animalCounts.forEach((count, animal) => {
        if (count > maxCount) {
          maxCount = count;
          dominantAnimal = animal;
        }
        if (count < minCount) {
          minCount = count;
          weakAnimal = animal;
        }
      });
  
      // Generate personality traits based on dominant elements
      const personalityTraits = this.getPersonalityTraits(dominantElement);
  
      // Generate compatibility based on elements
      const compatibility = this.getCompatibility(dominantElement);
  
      // Generate lucky attributes
      const luckyAttributes = this.getLuckyAttributes(dominantElement);
  
      // Generate challenges and opportunities
      const challenges = this.getChallenges(dominantElement, weakElement);
      const opportunities = this.getOpportunities(dominantElement, weakElement);
  
      return {
        elements: {
          dominant: dominantElement,
          weak: weakElement,
          all: elements
        },
        animals: {
          dominant: dominantAnimal,
          weak: weakAnimal,
          all: animals
        },
        personality: personalityTraits,
        compatibility: compatibility,
        lucky: luckyAttributes,
        challenges: challenges,
        opportunities: opportunities
      };
    }
  
    private getPersonalityTraits(element: string): string[] {
      const traits: { [key: string]: string[] } = {
        'Wood': [
          'Creative and innovative',
          'Strong leadership qualities',
          'Growth-oriented mindset',
          'Adaptable and flexible'
        ],
        'Fire': [
          'Passionate and energetic',
          'Charismatic and inspiring',
          'Dynamic and enthusiastic',
          'Natural leader'
        ],
        'Earth': [
          'Stable and reliable',
          'Practical and grounded',
          'Patient and nurturing',
          'Good at building relationships'
        ],
        'Metal': [
          'Disciplined and organized',
          'Strong sense of justice',
          'Determined and focused',
          'Value quality and precision'
        ],
        'Water': [
          'Intuitive and wise',
          'Adaptable and flexible',
          'Good at communication',
          'Deep understanding of others'
        ]
      };
      return traits[element] || ['Balanced personality traits'];
    }
  
    private getCompatibility(element: string): string[] {
      const compatibility: { [key: string]: string[] } = {
        'Wood': ['Fire', 'Earth'],
        'Fire': ['Earth', 'Metal'],
        'Earth': ['Metal', 'Water'],
        'Metal': ['Water', 'Wood'],
        'Water': ['Wood', 'Fire']
      };
      return compatibility[element] || ['Compatible with all elements'];
    }
  
    private getLuckyAttributes(element: string): { colors: string[], numbers: number[], directions: string[] } {
      const attributes: { [key: string]: { colors: string[], numbers: number[], directions: string[] } } = {
        'Wood': {
          colors: ['Green', 'Blue'],
          numbers: [3, 4],
          directions: ['East', 'Southeast']
        },
        'Fire': {
          colors: ['Red', 'Orange', 'Purple'],
          numbers: [9, 1],
          directions: ['South']
        },
        'Earth': {
          colors: ['Yellow', 'Brown'],
          numbers: [2, 5, 8],
          directions: ['Center', 'Northeast', 'Southwest']
        },
        'Metal': {
          colors: ['White', 'Gold'],
          numbers: [6, 7],
          directions: ['West', 'Northwest']
        },
        'Water': {
          colors: ['Black', 'Blue'],
          numbers: [1, 6],
          directions: ['North']
        }
      };
      return attributes[element] || {
        colors: ['All colors'],
        numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        directions: ['All directions']
      };
    }
  
    private getChallenges(dominant: string, weak: string): string[] {
      const challenges: { [key: string]: string[] } = {
        'Wood': [
          'May be too rigid in thinking',
          'Need to balance assertiveness',
          'Should develop patience'
        ],
        'Fire': [
          'May be too impulsive',
          'Need to control temper',
          'Should develop patience'
        ],
        'Earth': [
          'May be too conservative',
          'Need to embrace change',
          'Should take more risks'
        ],
        'Metal': [
          'May be too critical',
          'Need to be more flexible',
          'Should show more compassion'
        ],
        'Water': [
          'May be too emotional',
          'Need to be more decisive',
          'Should set clearer boundaries'
        ]
      };
      return challenges[dominant] || ['Balance your elements'];
    }
  
    private getOpportunities(dominant: string, weak: string): string[] {
      const opportunities: { [key: string]: string[] } = {
        'Wood': [
          'Great potential for growth',
          'Natural leadership abilities',
          'Creative opportunities'
        ],
        'Fire': [
          'Excellent for new ventures',
          'Strong influence on others',
          'Dynamic career opportunities'
        ],
        'Earth': [
          'Stable foundation for success',
          'Good for long-term projects',
          'Strong relationship building'
        ],
        'Metal': [
          'Excellent for organization',
          'Strong analytical abilities',
          'Good for detailed work'
        ],
        'Water': [
          'Great for communication',
          'Strong intuitive abilities',
          'Good for creative work'
        ]
      };
      return opportunities[dominant] || ['Focus on your strengths'];
    }
  } 