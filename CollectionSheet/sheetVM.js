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
			this.Accounts = ko.observableArray(ko.utils.arrayMap(item.Accounts || [], (x) => new models.Account(x)) || []);
			this.AccountGroupsTotal = ko.computed(x=> sum(ko.toJS(this.Accounts), 'CreditAmt'));
		}
		,Member: function (item) {
			var member = this;
			item = item || {};
			this.Name = ko.observable(item.Name || "John Doe");
			this.AccountGroups = ko.observableArray(ko.utils.arrayMap(item.AccountGroups || [], (x) => new models.AccountGroup(x)) || []);
			this.Accounts = ko.observableArray(ko.utils.arrayMap(item.Accounts || [], (x) => new models.Account(x)) || []);
			this.AccountsTotal = ko.computed(function (argument) {
				return sum(ko.toJS(member.Accounts), 'InstallmentAmt');
			});

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
			var account = new models.Account({
				AccountNo: "001",
				Balance: 11,
				AccountGroupCode: "01",
				AccountType: 1
			});
			var account2 = new models.Account({
				AccountNo: "001",
				Balance: 11,
				AccountGroupCode: "02",
				AccountType: 2
			});
			

			accounts = ko.observableArray([account]);
			accounts2 = ko.observableArray([account2, account2]);

			// self.AccountsTotal = ko.computed(function (argument) {
			// 	return sum(ko.toJS(self.Accounts()), 'Balance');
			// });


			/*MEMBER SECTION*/
			var member = new models.Member({AccountGroups: [{AccountGroupCode: "01", Accounts: ko.toJS(accounts)}, {AccountGroupCode: "02", Accounts: ko.toJS(accounts2)}]});
			var member2 = new models.Member({AccountGroups: [{AccountGroupCode: "01", Accounts: ko.toJS(accounts)}]});

			self.Members = ko.observableArray([member, member2]);
		}
	};

	var init = function (param) {
		UiElements.init();
	};

	init();
};


var obj = new CollectionSheet();
$(document).ready(function () {
	ko.applyBindings(obj);
})