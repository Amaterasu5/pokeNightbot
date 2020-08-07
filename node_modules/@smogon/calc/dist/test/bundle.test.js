"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
describe('Bundle', function () {
    test('usage', function () {
        {
            var window = {};
            eval(fs.readFileSync(path.resolve(__dirname, '../../dist/data/production.min.js'), 'utf8'));
            eval(fs.readFileSync(path.resolve(__dirname, '../../dist/production.min.js'), 'utf8'));
            var calc = window.calc;
            var gen = calc.Generations.get(5);
            var result = calc.calculate(gen, new calc.Pokemon(gen, 'Gengar', {
                item: 'Choice Specs',
                nature: 'Timid',
                evs: { spa: 252 },
                boosts: { spa: 1 }
            }), new calc.Pokemon(gen, 'Chansey', {
                item: 'Eviolite',
                nature: 'Calm',
                evs: { hp: 252, spd: 252 }
            }), new calc.Move(gen, 'Focus Blast'), new calc.Field({ attackerSide: new calc.Side({ isHelpingHand: true }) }));
            expect(result.range()).toEqual([410, 484]);
            expect(result.desc()).toEqual('+1 252 SpA Choice Specs Gengar Helping Hand Focus Blast vs. 252 HP / 252+ SpD Eviolite Chansey: 410-484 (58.2 - 68.7%) -- guaranteed 2HKO');
        }
    });
});
//# sourceMappingURL=bundle.test.js.map