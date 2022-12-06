# pokeNightbot


pokeNightbot is a lightweight project to add fetching functionality of certain Pokemon data to [Twitch](twitch.tv) chat through [Nightbot](nightbot.tv) commands. The aim is to provide ample information in a compact way, to avoid overloading the chat and staying within Twitch and Nightbot's character limits.

### Available Commands
#### !data [target]
>The **!data** command is useful for providing info about important aspects of the Pokemon metagame.
> [target] can be a **Pokemon**, **Pokemon Move**, **Ability**, or **Item**
> **since Nightbot registers spaces as delimiters, targets with more than one word must be separated by dashes and apostrophes should not be included**
- **!data [pokemon]** will display that pokemon's *base stats* in order (hp,atk,def,spa,spd,spe)
- **!data [move]** will display that move's *type*, *base power*, *base accuracy*, *base priority*,*maximum power points* (when PP Max has been used), *the type of damage* (special or physical), and *a short description of the move*.
- **!data [ability]** shows the *generation where the ability was originally introduced* as well as a *short description of the ability*.
- **!data [item]** will just display a *short description of the item*.

#### !learn [pokemon] [move] [gen(optional)]
>The **!learn** command checks to see whether a pokemon can learn a specified move given a specified generation. This is useful for competitions and the ranked ladder, as pokemon are only allowed to have moves that can be learned in this current generation.
>Pokemon not currently allowed in paldea will not have any learnable moves in gen 9.
>[pokemon] and [move] are interchangeable, and gen is an optional parameter that defaults to 9 if empty.
>**Pokemon and moves with multiple words must be separated by dashes**.

For example:
- **!learn conkeldurr close-combat 8**
will return "Yes, conkeldurr can learn close combat in gen 8." 
whereas
- **!learn meowscarada aqua-jet**
will return "No, meowscarada cannot learn aqua jet in gen 9."

#### !calc [attacker] [defender] [move] [field]
>Using [Pokemon Showdown's damage calc](https://calc.pokemonshowdown.com/), this command can calculate how much damage a pokemon will do to another based on its current stats, items, choice of move, and field effects. This information is usually presented as a range of percentage damage done that would be done to the defender at maximum HP.
>**This implementation was designed for Pokemon VGC and defaults to a doubles lvl50 setting. To use for singles, or single-target spread attacks, add "single" or "single-target" to the field description. Lvl100 coming soon.**
>*All spaces between words in a name must be replaced by dashes.*
- **[attacker]** is the name of the Pokemon performing the attack first, as well as any details about that Pokemon, separated by commas, in any order
--The available options are **"item="**, **"nature="**, **"ability="**, any of [**"hp="**, **"atk="**, **"def="**, **"spa="**, **"spd="**, **"spe="**], **"dynamax"**, and **"+/-number"** acting as a boost in the attacking stat.
- **[defender]** is the name of the Pokemon defending against the attack, then any details such as with the [attacker]
- **[move]** is the name of the attacking move
- **[field]** is a comma-separated description of the active effects on the field, such as a defender's Light Screen or an attacker's Helping Hand. Any or all of these inputs is optional.

--The available options for field are "**reflect**", "**light-screen**", "**friend-guard**", "**aurora-veil**", "**switch-in**", "**switch-out**", "**attacker-tailwind**", "**defender-tailwind**", "**helping-hand**", "**battery**", "**single**", any of [**"grassy"**,**"misty"**,**"psychic"**,**"electric"**] as terrain, any of ["**sand**", "**hail**", "**sun**", "**rain**", "**harsh-sunlight**", "**heavy-rain**", "**strong-winds**"] as weather, and "**gravity**".

For example:
!calc porygon-z,nature=modest,spa=252,ability=adaptability,item=life-orb,dynamax tyranitar,nature=adamant,hp=252,-2,dynamax,spd=4 hyper-beam sand,helping-hand
will return
252+ SpA Life Orb Adaptability Porygon-z Helping Hand Max Strike vs. -2 252 HP / 4 SpD Dynamax Tyranitar in Sand: 250-295 (60.3 - 71.2%) -- guaranteed 2HKO

### Error Correction
Currently there is a 2-character edit distance error correction implemented when what the user entered doesn't match an existing target on the !data and !learn commands. This guess is pretty good but imperfect, as there are a lot of Pokemon that are within 2 letters of each other.

### Todos

 - Write Tests
 - More user friendly?
 - Improve Error Correction?
