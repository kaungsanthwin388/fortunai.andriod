export interface BaziInput {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  latitude: number;
  longitude: number;
  isLunar: boolean;
}

export interface BaziResult {
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

export class BaziCalculator {
  private heavenlyStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  private earthlyBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  private birthDate: Date;
  private gender: string;
  private timezone: number;
  private isLunar: boolean;

  constructor(birthDate: Date, gender: string, timezone: number = 8, isLunar: boolean = false) {
    this.birthDate = birthDate;
    this.gender = gender;
    this.timezone = timezone;
    this.isLunar = isLunar;
  }

  calculate(): BaziResult {
    const year = this.birthDate.getFullYear();
    const month = this.birthDate.getMonth() + 1;
    const day = this.birthDate.getDate();
    const hour = this.birthDate.getHours();
    const minute = this.birthDate.getMinutes();

    // Calculate stems and branches
    const yearStem = this.heavenlyStems[((year - 4) % 10 + 10) % 10];
    const yearBranch = this.earthlyBranches[((year - 4) % 12 + 12) % 12];
    
    const monthStem = this.heavenlyStems[((year * 2 + month) % 10 + 10) % 10];
    const monthBranch = this.earthlyBranches[((month + 2) % 12 + 12) % 12];
    
    // For day pillar, we'll use a simplified calculation
    const dayIndex = Math.floor((year * 365 + month * 30 + day) % 60);
    const dayStem = this.heavenlyStems[(dayIndex % 10 + 10) % 10];
    const dayBranch = this.earthlyBranches[(dayIndex % 12 + 12) % 12];
    
    // For hour pillar
    const hourStem = this.heavenlyStems[((Math.floor(hour / 2) + dayIndex % 10) % 10 + 10) % 10];
    const hourBranch = this.earthlyBranches[Math.floor(hour / 2)];

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

  getCompleteAnalysis(): BaziResult {
    const bazi = this.calculate();
    return bazi;
  }
} 