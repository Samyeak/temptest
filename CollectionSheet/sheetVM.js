/*OVERRIDE TO GET BOTH NEW AND OLD VALUE*/
ko.subscribable.fn.subscribeChanged = function (callback) {
    var savedValue = this.peek();
    return this.subscribe(function (latestValue) {
        var oldValue = savedValue;
        savedValue = latestValue;
        callback(latestValue, oldValue);
    });
};
/*NUMERIC EXTENDER*/
ko.extenders.numeric = function(target, precision) {
    //create a writable computed observable to intercept writes to our observable
    var result = ko.pureComputed({
        read: target,  //always return the original observables value
        write: function(newValue) {
            var current = target(),
                roundingMultiplier = Math.pow(10, precision),
                newValueAsNum = isNaN(newValue) ? 0 : +newValue,
                valueToWrite = Math.round(newValueAsNum * roundingMultiplier) / roundingMultiplier;

            //only write if it changed
            if (valueToWrite !== current) {
                target(valueToWrite);
            } else {
                //if the rounded value is the same, but a different value was written, force a notification for the current field
                if (newValue !== current) {
                    target.notifySubscribers(valueToWrite);
                }
            }
        }
    }).extend({ notify: 'always' });
 
    //initialize with current value to make sure it is rounded appropriately
    result(target());
 
    //return the new computed observable
    return result;
};



/*VALIDATOR EXTENDER*/
ko.extenders.required = function(target, overrideMessage) {
    //add some sub-observables to our observable
    target.hasError = ko.observable();
    target.validationMessage = ko.observable();
 
    //define a function to do validation
    function validate(newValue) {
       target.hasError(newValue ? false : true);
       target.validationMessage(newValue ? "" : overrideMessage || "This field is required");
    }
 
    //initial validation
    validate(target());
 
    //validate whenever the value changes
    target.subscribe(validate);
 
    //return the original observable
    return target;
};

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
			// this.AccountGroups = ko.observableArray(ko.utils.arrayMap(item.AccountGroups || [], (x) => new models.AccountGroup(x)) || []);
			this.Accounts = ko.observableArray(ko.utils.arrayMap(item.Accounts || [], (x) => new models.Account(x)) || []);

			this.TotalAmount = ko.observable(item.TotalAmount || 500).extend({numeric: 2, required: "Required"});
			this.LimitAmount = ko.observable(item.LimitAmount || 5000).extend({numeric: 2});

			this.AccountsTotal = ko.computed(function (argument) {
				return sum(ko.toJS(member.Accounts), 'InstallmentAmt');
			});

			//subscribe test
			this.TotalAmount.subscribeChanged(function(x,y){
				console.log(`${x}, ${y}`);
			});


			// this.MemberTotal = ko.computed(x=> sum(ko.toJS(this.AccountGroups), 'AccountGroupsTotal'));
			
		}
		,Group: function (item) {
			var group = this;
			item = item || {};
			this.GroupCode = ko.observable(item.GroupCode || "001");
			this.Members = ko.observableArray(ko.utils.arrayMap(item.Members || [], (x) => new models.Member(x)) || []);

			this.MemberTotal = ko.computed(x=> sum(ko.toJS(this.Members), 'AccountsTotal'));
		}
		,AccountGroupParam : function (item) {
			var accountGroup = this;
			item = item || {};
			this.AccountGroupCode = ko.observable(item.AccountGroupCode || "01");
			this.AccountType = ko.observable(item.AccountType || "04");
		}
	};

	var UiElements = {
		init : function (param) {
			self.Groups= ko.observableArray([]);
			self.Members = ko.observableArray([]);
			self.AccountGroups = ko.observableArray([]);
			self.AccountGroupCodes = ko.observableArray([]);
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
						AccountNo: "002000023",
						InterestAmt: 200,
						AccountGroupCode: "02",
						AccountType: "04"
					},
					{
						AccountNo: "002000152",
						InterestAmt: 600,
						AccountGroupCode: "02",
						AccountType: "04"
					},
					{
						AccountNo: "002000152",
						InterestAmt: 600,
						AccountGroupCode: "03",
						AccountType: "04"
					}
				]
			}; //END of Member Z
				var memberY = {
				Name : "Narayan Gopal",
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
							},
							{
								AccountNo: "003006545",
								CreditAmt: 2200,
								AccountGroupCode: "03",
								AccountType: "04"
							}
						]
			}; //END of MemberY

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
							}
						]
					}
				]
			}; //END of Member One

			var groupOne = {
				GroupCode: "001",
				Members: [
				memberZ, memberY
				]
			}
			//INITIALIXATIONS
			self.Members([new models.Member(memberZ), new models.Member(memberY)]);
			self.Groups([new models.Group(groupOne)]);

			
			var ok = [...new Set(
				ko.toJS(self.Groups)
					.map(x=>x.Members)
						.reduce((total, group)=>total = total.concat(member))
							//MAP ONLY ACCOUNTS LIST FROM MEMBER LIST
							.map(x=>x.Accounts)
							//MERGE ALL ACCOUNTS LIST INTO ONE ARRAY
								.reduce((total, member)=>total = total.concat(member))
								//GET ONLY ACCOUNT GROUP CODES FROM ACCOUNT LIST
									.map(x=>x.AccountGroupCode)
									)
			]
			self.AccountGroupCodes(ok);
			self.AccountGroups(ko.toJS(self.AccountGroupCodes).map(item=> new models.AccountGroupParam({AccountGroupCode: item})));
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