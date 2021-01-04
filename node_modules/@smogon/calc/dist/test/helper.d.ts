import * as I from '../data/interface';
import { Pokemon, Move, Result } from '../index';
import { State } from '../state';
import { Field, Side } from '../field';
declare const calc: (gen: I.GenerationNum) => (attacker: Pokemon, defender: Pokemon, move: Move, field?: Field | undefined) => Result;
declare const move: (gen: I.GenerationNum) => (name: string, options?: Partial<Pick<State.Move, "name" | "overrides" | "useZ" | "useMax" | "isCrit" | "hits" | "timesUsed" | "timesUsedWithMetronome">> & {
    ability?: string | undefined;
    item?: string | undefined;
    species?: string | undefined;
}) => Move;
declare const pokemon: (gen: I.GenerationNum) => (name: string, options?: Partial<Pick<State.Pokemon, "name" | "boosts" | "status" | "level" | "abilityOn" | "isDynamaxed" | "gender" | "ivs" | "evs" | "originalCurHP" | "toxicCounter" | "overrides">> & {
    ability?: string | undefined;
    item?: string | undefined;
    nature?: string | undefined;
    moves?: string[] | undefined;
    curHP?: number | undefined;
    ivs?: (Partial<I.StatsTable<number>> & {
        spc?: number | undefined;
    }) | undefined;
    evs?: (Partial<I.StatsTable<number>> & {
        spc?: number | undefined;
    }) | undefined;
    boosts?: (Partial<I.StatsTable<number>> & {
        spc?: number | undefined;
    }) | undefined;
}) => Pokemon;
declare const field: (field?: Partial<State.Field>) => Field;
declare const side: (side?: State.Side) => Side;
interface Gen {
    gen: I.GenerationNum;
    calculate: ReturnType<typeof calc>;
    Pokemon: ReturnType<typeof pokemon>;
    Move: ReturnType<typeof move>;
    Field: typeof field;
    Side: typeof side;
}
export declare function inGen(gen: I.GenerationNum, fn: (gen: Gen) => void): void;
export declare function inGens(from: I.GenerationNum, to: I.GenerationNum, fn: (gen: Gen) => void): void;
export declare function tests(name: string, fn: (gen: Gen) => void, type?: 'skip' | 'only'): void;
export declare function tests(name: string, from: I.GenerationNum, fn: (gen: Gen) => void, type?: 'skip' | 'only'): void;
export declare function tests(name: string, from: I.GenerationNum, to: I.GenerationNum, fn: (gen: Gen) => void, type?: 'skip' | 'only'): void;
declare global {
    namespace jest {
        interface Matchers<R, T> {
            toMatch(gen: I.GenerationNum, notation?: '%' | 'px' | ResultDiff, diff?: ResultDiff): R;
        }
    }
}
declare type ResultDiff = Partial<Record<I.GenerationNum, Partial<ResultBreakdown>>>;
interface ResultBreakdown {
    range: [number, number];
    desc: string;
    result: string;
}
export {};
