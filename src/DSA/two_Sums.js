let nums = [1,2,4,7,35];
let target = 9;

var twoSums = function(nums,target){
    for(let i = 0; i< nums.length; i++){
         for(let j = 0; j< nums.length; j++){
            if(nums[i]+ nums[j] == target){
                return [i,j]
            }
    }
}
}
console.log(twoSums(nums,target))