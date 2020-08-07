import { Natures, Generation, TypeName, StatName, StatsTable } from './data/interface';
export declare const STATS: Array<Array<StatName | 'spc'> | StatName[]>;
export declare const Stats: {
    displayStat(stat: "hp" | "atk" | "def" | "spa" | "spd" | "spe" | "spc"): "HP" | "Atk" | "Def" | "SpA" | "SpD" | "Spe" | "Spc";
    shortForm(stat: "hp" | "atk" | "def" | "spa" | "spd" | "spe" | "spc"): "hp" | "at" | "df" | "sa" | "sd" | "sp" | "sl";
    getHPDV(ivs: {
        atk: number;
        def: number;
        spe: number;
        spc: number;
    }): number;
    IVToDV(iv: number): number;
    DVToIV(dv: number): number;
    DVsToIVs(dvs: Readonly<Partial<StatsTable<number>>>): Partial<StatsTable<number>>;
    calcStat(gen: Generation, stat: StatName, base: number, iv: number, ev: number, level: number, nature?: string | undefined): number;
    calcStatADV(natures: Natures, stat: StatName, base: number, iv: number, ev: number, level: number, nature?: string | undefined): number;
    calcStatRBY(stat: StatName, base: number, iv: number, level: number): number;
    calcStatRBYFromDV(stat: StatName, base: number, dv: number, level: number): number;
    getHiddenPowerIVs(gen: Generation, hpType: "Fighting" | "Flying" | "Poison" | "Ground" | "Rock" | "Bug" | "Ghost" | "Steel" | "Fire" | "Water" | "Grass" | "Electric" | "Psychic" | "Ice" | "Dragon" | "Dark"): Partial<StatsTable<number>> | undefined;
    getHiddenPower(gen: Generation, ivs: StatsTable<number>): {
        type: TypeName;
        power: number;
    };
};
