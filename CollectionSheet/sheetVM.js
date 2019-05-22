var sum = function (array, property) {
	return array.reduce( function(a, b){
		return parseFloat(a) + parseFloat(b[property]);
	}, 0);
};

var CollectionSheet = function (argument) {
	var self = this;
	var models = {
		Account : function (item) {
			item = item || {};
			this.AccountNo = ko.observable(item.AccountNo || "11");
			this.AccountType = ko.observable(item.AccountType || "1");
			this.AccountGroupCode = ko.observable(item.AccountGroupCode || "01");

			this.Balance = ko.observable(item.Balance || 11);
			this.DebitAmt = ko.observable(item.DebitAmt || 4);
			this.CreditAmt = ko.observable(item.CreditAmt || 3);
			this.PrincipalAmt = ko.observable(item.PrincipalAmt || 5000);
			this.InterestAmt = ko.observable(item.InterestAmt || 700);
			this.InstallmentAmt = ko.observable(item.InstallmentAmt || 5700);

		}
		,AccountGroup : function (item) {
			var accountGroup = this;
			item = item || {};
			this.AccountGroupCode = ko.observable(item.AccountGroupCode || "01");
			this.AccountType = ko.observable(item.AccountType || "04");
			this.Accounts = ko.observableArray(ko.utils.arrayMap(item.Accounts || [], (x) => new models.Account(x)) || []);
			this.AccountGroupsTotal = ko.computed(x=> sum(ko.toJS(this.Accounts), 'CreditAmt'));
		}
		,Member: function (item) {
			var member = this;
			item = item || {};
			this.Name = ko.observable(item.Name || "John Doe");
			this.AccountGroups = ko.observableArray(ko.utils.arrayMap(item.AccountGroups || [], (x) => new models.AccountGroup(x)) || []);
			// this.Accounts = ko.observableArray(ko.utils.arrayMap(item.Accounts || [], (x) => new models.Account(x)) || []);
			// this.AccountsTotal = ko.computed(function (argument) {
			// 	return sum(ko.toJS(member.Accounts), 'InstallmentAmt');
			// });

			this.MemberTotal = ko.computed(x=> sum(ko.toJS(this.AccountGroups), 'AccountGroupsTotal'));
			
		}
		,Group: function (item) {
			var group = this;
			item = item || {};
			this.GroupCode = ko.observable(item.GroupCode || "001");
			this.Members = ko.observableArray(ko.utils.arrayMap(item.Members || [], (x) => new models.Member(x)) || []);

			this.MemberTotal = ko.computed(x=> sum(ko.toJS(this.Members), 'MemberTotal'));
		}
	};

	var UiElements = {
		init : function (param) {
			self.Members = ko.observableArray([]);
			self.AccountGroups = ko.observableArray([]);
		},
		demo:function (argument) {
			var memberZ = {
				Name : "Laxmi Prasad Devkota",
				Accounts : [
					{
						AccountNo: "001000002",
						InterestAmt: 500,
						AccountGroupCode: "01",
						AccountType: "03"
					},
					{
						AccountNo: "001000023",
						InterestAmt: 200,
						AccountGroupCode: "01",
						AccountType: "03"
					},
					{
						AccountNo: "001000152",
						InterestAmt: 600,
						AccountGroupCode: "01",
						AccountType: "03"
					}
				]
			}; //END of Member Z

			var memberOne = {
				Name : "Laxmi Prasad Devkota",
				AccountGroups : [
					{
						AccountGroupCode : "01",
						AccountType: "03",
						Accounts : [
							{
								AccountNo: "001000002",
								InterestAmt: 500,
								AccountGroupCode: "01",
								AccountType: "03"
							},
							{
								AccountNo: "001000023",
								InterestAmt: 200,
								AccountGroupCode: "01",
								AccountType: "03"
							}
						]
					},
					{
						AccountGroupCode : "02",
						AccountType: "04",
						Accounts : [
							{
								AccountNo: "002001254",
								CreditAmt: 1200,
								AccountGroupCode: "02",
								AccountType: "04"
							},
							{
								AccountNo: "002001258",
								CreditAmt: 1800,
								AccountGroupCode: "02",
								AccountType: "04"
							}
						]
					},
					{
						AccountGroupCode : "03",
						AccountType: "04",
						Accounts : [
							{
								AccountNo: "003006545",
								CreditAmt: 2200,
								AccountGroupCode: "03",
								AccountType: "04"
							},
							{
								AccountNo: "003006589",
								CreditAmt: 2800,
								AccountGroupCode: "03",
								AccountType: "04"
							}
						]
					}
				]
			}; //END of Member One
			self.Members([new models.Member(memberOne)/*, new models.Member(memberTwo)*/]);
		}
	};

	var init = function (param) {
		UiElements.init();
		UiElements.demo()
	};

	init();
};


var obj = new CollectionSheet();
$(document).ready(function () {
	ko.applyBindings(obj);
})