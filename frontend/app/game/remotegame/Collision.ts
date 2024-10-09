
export function getRandomName(): string {
    const adjectives = [
      "Brave", "Calm", "Delightful", "Eager", "Fancy", 
      "Gentle", "Happy", "Jolly", "Kind", "Lively", 
      "Mighty", "Nice", "Proud", "Quick", "Royal"
    ];
  
    const nouns = [
      "Lion", "Tiger", "Eagle", "Hawk", "Falcon", 
      "Shark", "Wolf", "Bear", "Fox", "Whale", 
      "Panda", "Elephant", "Cheetah", "Leopard", "Rhino"
    ];
  

    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    return `${randomAdjective}`;
  }
  