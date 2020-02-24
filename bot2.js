const VkBot = require('node-vk-bot-api')
const Markup = require('node-vk-bot-api/lib/markup')
const api = require('node-vk-bot-api/lib/api')

const bot = new VkBot('7ab78831d30fc3cac9bd55e79fa2ce1b44271d6afd0b786bd01ea9eee48bb29f5c69ebb0ed901e52ac7f8')
const n_semena = ['🌾пшеница', '🌻подсолнух', '🌽кукуруза','🥔картошка']
const n_semena_r = ['пшеницы', 'подсолнуха', 'кукурузы','Картошки']
const semena_s = ['Пшеница', 'Подсолнух', 'Кукуруза','Картошка']
const opit = [1,3,7,15,30,50,100,180,300,550,790,1000,3000]
const semena = {
	"Пшеница" : {
		"price" : 2,
		"RostTime" : 5,
		"PosTime" : 0.1,
		"SborTime" : 0.2,
		"op" : 0.1,
		"lvl" : 1
	},
	"Подсолнух" : {
		"price" : 5,
		"RostTime" : 10,
		"PosTime" : 0.2,
		"SborTime" : 0.4,
		"op" : 0.2,
		"lvl" : 2
	},
	"Кукуруза": { 
		"price" : 8,
		"RostTime" : 20,
		"PosTime" : 0.3,
		"SborTime" : 0.6,
		"op" : 0.3,
		"lvl" : 3
	},
	"Картошка": { 
		"price" : 15,
		"RostTime" : 30,
		"PosTime" : 0.5,
		"SborTime" : 1,
		"op" : 0.5,
		"lvl" : 5
	},
}
let all_semena = 4;
let users = require('./users.json')
function isInteger(num) {
  return (num ^ 0) === num;
}
function saveUser() {
	require('fs').writeFileSync('./users.json', JSON.stringify(users, null, '\t'))
}

async function GetName(id) {
let response = await bot.execute('users.get', {
  user_ids: id,
  fields: 'city,photo_50'
})
users[id].tag = response[0]["first_name"]
console.log(response)
saveUser()
}

bot.command('Профиль', (ctx) => {
	if (String(ctx.message.peer_id) in users) {
		let g = opit[users[ctx.message.peer_id].lvl-1] - users[ctx.message.peer_id].op
		ctx.reply('Твой баланс: ' + users[ctx.message.peer_id].balance
			+ '\n Твой уровень: ' + users[ctx.message.peer_id].lvl
			+ '\n Твой опыт: ' + users[ctx.message.peer_id].op
			+ '\n До нового уровня осталось: ' + g )
	}
	else {
		ctx.reply('Зарегистрируйся')
	}
})

bot.command('Начать', (ctx) => {
	if (String(ctx.message.peer_id) in users) {
		ctx.reply('Ты уже зарегистрирован')
	}
	else {
		users["globalId"]++
		Object.assign(users, 
	 	{  [ctx.message.peer_id]: {
	 	   "id" : users["globalId"],
	 	   "op" : 0,
	 	   "lvl" : 1,
   		   "balance": 100,
   		   "tag" : GetName(ctx.message.peer_id),
   		   "location": "Нет",
   		   "p_prov": 0,
   		   "s_prov": 0,
   		   "s_semena" : {
   		   		"Пшеница" : 0,
   		  		"Подсолнух" : 0,
   		  		"Кукуруза" : 0,
   		  		"Картошка" : 0
   		   },
   		   "k_semena" : {
   		  		"Пшеница" : 0,
   		  		"Подсолнух" : 0,
   		  		"Кукуруза" : 0,
   		  		"Картошка" : 0
   		    },
			"p_semena" : {
				"Пшеница": 0,
				"Подсолнух": 0,
				"Кукуруза": 0,
				"Картошка" : 0
			},
   		    "v_semena" : {
   		   		"Пшеница" : 0,
   		  		"Подсолнух" : 0,
   		  		"Кукуруза" : 0,
   		  		"Картошка" : 0
   		    },
   		    "t_semena" : {
   		   		"Пшеница" : 0,
   		  		"Подсолнух" : 0,
   		  		"Кукуруза" : 0,
   		  		"Картошка" : 0
   		    },
   		    "n" : -1
	    }});
	    users["globalUserUid"].push(+ctx.message.peer_id)
		ctx.reply('Ты успешно зарегистрировался')
		saveUser()
	}
})
bot.command('test', (ctx) => {
	ctx.reply('1')
	setTimeout(function() {ctx.reply('2')}, 5000)
})

bot.command('Огород', (ctx) => {
if (String(ctx.message.peer_id) in users) {
	ctx.reply('На твоем огороде: \n Растет: \n 🌾Пшеницы - '
	 + users[ctx.message.peer_id].p_semena['Пшеница']
	  + '\n 🌻Подсолнухов - '
	   + users[ctx.message.peer_id].p_semena['Подсолнух']
	    + '\n 🌽Кукурузы - '
	     + users[ctx.message.peer_id].p_semena['Кукуруза']
	      + '\n 🥔Картошки - '
	       + users[ctx.message.peer_id].p_semena['Картошка'], null, Markup
	     .keyboard([
	     	[
	     	Markup.button('Собрать урожай', 'positive'),
	     	Markup.button('Посадить семена', 'positive'),
	     	Markup.button('Растёт', 'positive'),
	     	]
	     ])
	     .inline());
	users[ctx.message.peer_id].location = 'Огород'
	saveUser()
}
else {
	ctx.reply('Зарегистрируйся')
}
})

bot.command('Растёт', (ctx) => {
if (String(ctx.message.peer_id) in users) {
	ctx.reply('На твоем огороде растет:'
		+ '\n 🌾 Пшеница: ' + users[ctx.message.peer_id].p_semena['Пшеница'] + '🌱 ' + users[ctx.message.peer_id].t_semena['Пшеница'] + 'м.⏰'
		+ '\n 🌻 Подсолнух: ' + users[ctx.message.peer_id].p_semena['Подсолнух'] + '🌱 ' + users[ctx.message.peer_id].t_semena['Подсолнух'] + 'м.⏰'
		+ '\n 🌽 Кукуруза: ' + users[ctx.message.peer_id].p_semena['Кукуруза'] + '🌱 ' + users[ctx.message.peer_id].t_semena['Кукуруза'] + 'м.⏰'
		+ '\n 🥔 Картошка: ' + users[ctx.message.peer_id].p_semena['Картошка'] + '🌱 ' + users[ctx.message.peer_id].t_semena['Картошка'] + 'м.⏰')
}
else {
	ctx.reply('Зарегистрируйся')
}
})

bot.command('Склад', (ctx) => {
if (String(ctx.message.peer_id) in users) {
	ctx.reply('Твои семена: \n 🌾Пшеница : '
	 + users[ctx.message.peer_id].k_semena["Пшеница"]
	  + "\n 🌻Подсолнух : " + users[ctx.message.peer_id].k_semena["Подсолнух"]
	   + "\n 🌽Кукуруза : "
	    + users[ctx.message.peer_id].k_semena["Кукуруза"]
	     + "\n 🥔Картошка : "
	      + users[ctx.message.peer_id].k_semena["Картошка"])
}
else {
	ctx.reply('Зарегистрируйся')
}
})

bot.command('Собрать урожай', (ctx) => {
if (String(ctx.message.peer_id) in users) {
	if ((users[ctx.message.peer_id].location == 'Огород') && (users[ctx.message.peer_id].s_prov == 0)) {
		let v = users[ctx.message.peer_id].v_semena;
		let k = 0;
		for (let key in semena) {
			if (v[key] >= 1) {
				k++
			}
		}
		if (k >= 1) {
			let t = 0;
			for (let key in semena) {
				t += users[ctx.message.peer_id].v_semena[key] * semena[key].SborTime;
			}
			let op = 0;
			for (let key in semena) {
				op += users[ctx.message.peer_id].v_semena[key] * semena[key].op
				users[ctx.message.peer_id].t_semena[key] = 0;
			}
			t = Math.floor(t)
			if (t == 0) {
				t = 1
			}
			ctx.reply('Ты соберешь весь свой урожай за '
			 + t
			  + ' минут \n Будет собрано: \n 🌾Пшеницы - '
			   + users[ctx.message.peer_id].v_semena['Пшеница']
			    + '\n 🌻Подсолнухов - '
			     + users[ctx.message.peer_id].v_semena['Подсолнух']
			      + '\n 🌽Кукурузы - '
			       + users[ctx.message.peer_id].v_semena['Кукуруза']
			       	+ '\n 🥔Картошка - '
			         + users[ctx.message.peer_id].v_semena['Картошка']
			          + '\n Будет получено опыта:'
			           + op)
			users[ctx.message.peer_id].s_prov = 1;
			saveUser();
			setTimeout(function() {
				let id = ctx.message.peer_id;
				for (let key in semena) {
					users[id].s_semena[key] += users[id].v_semena[key]
					users[id].v_semena[key] = 0;
				}
				users[id].op += op;
				if (users[id].op >= opit[users[id].lvl-1]) {
					ctx.reply('Урожай собран и у тебя новый уровень')
					users[id].lvl++
					users[id].op = 0
				}
				else {
					ctx.reply('Урожай собран')
					console.log(opit[1])
					console.log(users[id].op)
				}
				users[ctx.message.peer_id].s_prov = 0;
				saveUser();
			}, t * 1000)
		}
		else {
			ctx.reply('У тебя еще не вырос урожай')
		}
	}
	else {
		if (users[ctx.message.peer_id].location == 'Нет') {
			ctx.reply('Ты не в огороде')
		}
		else {
			if (users[ctx.message.peer_id].s_prov == 1) {
				ctx.reply('У тебя уже идет сбор урожая')
			}
		}
	}
}
else {
	ctx.reply('Зарегистрируйся')
}
})

bot.command('Магазин', (ctx) => {
	ctx.reply('Ты в магазине, вот все наши семена \n (1 уровень) - 🌾Пшеница 2₽/1семя \n (2 уровень) - 🌻Подсолнух 5₽/1семя \n (3 уровень) - 🌽Кукуруза 8₽/1семя \n (5 уровень) - 🥔Картошка 15₽/1семя \n Для покупки введите: \n Купить семена', null, Markup
	.keyboard(
	[
		[
		Markup.button('Купить семена')
		]
	])
	.inline()
	)
	users[ctx.message.peer_id].location = "Магазин"
	saveUser()
})
bot.on((ctx)=> {
if (String(ctx.message.peer_id) in users) {
	let message = ctx.message.text;
	message = message.toLowerCase();

//покупка семян
	if (users[ctx.message.peer_id].location == 'Выбор количества для покупки') {
		if ((!isNaN(+message))
			&& (+message >= 1)
			 && (users[ctx.message.peer_id].balance >= +message * semena[semena_s[users[ctx.message.peer_id].n]].price)
			  && (isInteger(+message))
			   && (users[ctx.message.peer_id].lvl >= semena[semena_s[users[ctx.message.peer_id].n]].lvl)) {
			users[ctx.message.peer_id].balance -= +message * semena[semena_s[users[ctx.message.peer_id].n]].price
			users[ctx.message.peer_id].k_semena[semena_s[users[ctx.message.peer_id].n]] += +message
			users[ctx.message.peer_id].location = 'Нет'
			ctx.reply('Ты купил ' + +message + ' семян ' + n_semena_r[users[ctx.message.peer_id].n] + ' за ' + +message * semena[semena_s[users[ctx.message.peer_id].n]].price + "₽")
			users[ctx.message.peer_id].n = -1;
			saveUser()
		}
		else {
		if (users[ctx.message.peer_id].lvl >= semena[semena_s[users[ctx.message.peer_id].n]].lvl) {
			if (users[ctx.message.peer_id].balance <= +message * semena[semena_s[users[ctx.message.peer_id].n]].price) {
				ctx.reply('Вам не хватает денег для покупки')
				users[ctx.message.peer_id].location = 'Нет'
				users[ctx.message.peer_id].n = -1
				saveUser()
			}
			else {
				ctx.reply('Вы ввели не правильное количество')
				users[ctx.message.peer_id].location = 'Нет'
				users[ctx.message.peer_id].n = -1
				saveUser()
			}
		}
		else {
			ctx.reply('У вас не достаточный уровень для покупки этих семян')
		}
		}
	}
	if (users[ctx.message.peer_id].location == 'Выбор названия семян') {
		for (let i = 0; i < all_semena; i++) {
			if (message == n_semena[i]) {
				users[ctx.message.peer_id].n = i;
				saveUser();
				break;
			}
		}
		if (users[ctx.message.peer_id].n >= 0) {
			ctx.reply('Введи количество семян ' + n_semena_r[users[ctx.message.peer_id].n] + ' которое хочешь купить')
			users[ctx.message.peer_id].location = 'Выбор количества для покупки'
			saveUser()
		}
		else {
			ctx.reply('Таких семян в наш магазин не завезли :(')
		}	
	}
	if ((message == 'купить семена') && (users[ctx.message.peer_id].location == 'Магазин')) {
		ctx.reply('Выбери что тебе нужно купить:', null, Markup
			.keyboard([
				[
				Markup.button('🌾Пшеница','positive'),
				Markup.button('🌻Подсолнух','positive'),
				Markup.button('🌽Кукуруза','positive'),
				Markup.button('🥔Картошка','positive'),
				]
			])
			.inline()
		)
		users[ctx.message.peer_id].location = 'Выбор названия семян'
		saveUser()
	}
	else {
		if ((message == 'купить семена') && (users[ctx.message.peer_id].location == 'Нет')) {
			ctx.reply('Ты не в магазине')
		}
	}
	



//посадка семян

if (users[ctx.message.peer_id].location == 'Выбор количества для посадки') {
	if ((!isNaN(+message))
		&& (+message >= 1)
		 && (+message <= users[ctx.message.peer_id].k_semena[semena_s[users[ctx.message.peer_id].n]])
		  && (isInteger(+message))
		   && (users[ctx.message.peer_id].p_prov == 0)) {
			let id = ctx.message.peer_id;
			let n = users[ctx.message.peer_id].n
			n++
			let k = +message;
		 	let t = Math.floor(k * semena[semena_s[n-1]]["PosTime"])
		 	if (t == 0) {
		 		t = 1
		 	}
			ctx.reply('Будет посажено ' + k + ' семян '+ n_semena_r[n-1] + '\n Время посадки займет ' + t + ' минут')
			users[id].p_prov = 1;
			saveUser()
			setTimeout(function() {
			users[id].t_semena[semena_s[n-1]] = 0;
			users[id].k_semena[semena_s[n-1]] -= k;
			users[id].p_semena[semena_s[n-1]] += k;
			users[id].p_prov = 0;
			users[id].location = 'Нет'
			saveUser()
			ctx.reply('Семена успешно посажены')
			}, t * 60000)
			console.log(t)
	}
	else {
		console.log(users[ctx.message.peer_id].n)
		console.log(+message)
		console.log(users[ctx.message.peer_id].k_semena[semena_s[users[ctx.message.peer_id].n]])
		if (users[ctx.message.peer_id].p_prov == 0) {
			if (+message >= users[ctx.message.peer_id].k_semena[semena_s[users[ctx.message.peer_id].n]]) {
				ctx.reply('Вам не хватает семян для посадки')
				users[ctx.message.peer_id].location = 'Нет'
				users[ctx.message.peer_id].n = -1
				saveUser()
			}
			else {
				ctx.reply('Вы ввели не правильное количество')
				users[ctx.message.peer_id].location = 'Нет'
				users[ctx.message.peer_id].n = -1
				saveUser()
			}
		}
		else {
			ctx.reply('У тебя уже идет посадка семян')
		}
	}
}

if (users[ctx.message.peer_id].location == 'Выбор названия семян для посадки') {
	for (let i = 0; i < all_semena; i++) {
		if (message == n_semena[i]) {
			users[ctx.message.peer_id].n = i;
			saveUser();
			break;
		}
	}
	if (users[ctx.message.peer_id].n >= 0) {
		ctx.reply('Введи количество семян ' + n_semena_r[users[ctx.message.peer_id].n] + ' которое хочешь посадить')
		users[ctx.message.peer_id].location = 'Выбор количества для посадки'
		saveUser()
	}
	else {
		ctx.reply('Таких семян не существует :(')
	}	
}

if ((message == 'посадить семена') && (users[ctx.message.peer_id].location == 'Огород')) {
	ctx.reply('Выбери что тебе нужно посадить:', null, Markup
		.keyboard([
			[
			Markup.button('🌾Пшеница','positive'),
			Markup.button('🌻Подсолнух','positive'),
			Markup.button('🌽Кукуруза','positive'),
			Markup.button('🥔Картошка','positive'),
			]
		])
		.inline()
	)
	users[ctx.message.peer_id].location = 'Выбор названия семян для посадки'
	saveUser()
}
else {
	if ((message == 'посадить семена') && (users[ctx.message.peer_id].location == 'Нет')) {
		ctx.reply('Ты не на огороде')
	}
}
}
else {
	ctx.reply('Зарегистрируйся')
}
})

//рост семян
setInterval(function() {
	for (let key in users) {
		if (!isNaN(+key)) {
			for (let k in semena) {
				if ((users[key].s_prov == 0) && (users[key].p_prov == 0) && (users[key].p_semena[k] >= 1)) {
					users[key]["t_semena"][k]++
					saveUser()
					if (users[key]["t_semena"][k] == semena[k]["RostTime"]) {
						console.log(users[key]["t_semena"][k])
						users[key]["t_semena"][k] = 0
						users[key]["v_semena"][k] += users[key]["p_semena"][k]
						saveUser()
					}
				}
			}
		}
	}
}, 60000)

bot.startPolling()


