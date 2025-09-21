// complaint_system.js

let issueCounter = 1;
let agentCounter = 1;

class Issue {
  constructor(transactionId, issueType, subject, description, email) {
    this.id = "I" + issueCounter++;
    this.transactionId = transactionId;
    this.issueType = issueType;
    this.subject = subject;
    this.description = description;
    this.email = email;
    this.status = "Open";
    this.resolution = null;
    this.assignedAgent = null;
  }
}

class Agent {
  constructor(email, name, expertise) {
    this.id = "A" + agentCounter++;
    this.email = email;
    this.name = name;
    this.expertise = new Set(expertise);
    this.currentIssue = null;
    this.queue = [];
    this.workHistory = [];
  }
}

class ComplaintSystem {
  constructor() {
    this.issues = new Map();
    this.agents = new Map();
  }

  createIssue(transactionId, issueType, subject, description, email) {
    const issue = new Issue(transactionId, issueType, subject, description, email);
    console.log(issue)
    this.issues.set(issue.id, issue);
    console.log(`>>> Issue ${issue.id} created against transaction "${transactionId}"`);
    return issue;
  }

  addAgent(agentEmail, agentName, issueTypes) {
    const agent = new Agent(agentEmail, agentName, issueTypes);
    this.agents.set(agent.id, agent);
    console.log(`>>> Agent ${agent.id} created`);
    return agent;
  }

  assignIssue(issueId) {
    const issue = this.issues.get(issueId);
    if (!issue) return console.log(`Issue ${issueId} not found`);

    for (let agent of this.agents.values()) {
      if (agent.expertise.has(issue.issueType)) {
        if (!agent.currentIssue) {
          agent.currentIssue = issue.id;
          issue.assignedAgent = agent.id;
          console.log(`>>> Issue ${issue.id} assigned to agent ${agent.id}`);
          return;
        } else {
          agent.queue.push(issue.id);
          issue.assignedAgent = agent.id;
          console.log(`>>> Issue ${issue.id} added to waitlist of Agent ${agent.id}`);
          return;
        }
      }
    }
    console.log(`>>> No agent available with expertise for ${issue.issueType}`);
  }

  getIssues(filter) {
    let results = [];
    for (let issue of this.issues.values()) {
      if (filter.email && issue.email !== filter.email) continue;
      if (filter.type && issue.issueType !== filter.type) continue;
      results.push(issue);
    }
    for (let i of results) {
      console.log(`${i.id} {"${i.transactionId}", "${i.issueType}", "${i.subject}", "${i.description}", "${i.email}", "${i.status}"}`);
    }
    return results;
  }

  updateIssue(issueId, status, resolution) {
    const issue = this.issues.get(issueId);
    if (!issue) return console.log(`Issue ${issueId} not found`);
    issue.status = status;
    issue.resolution = resolution;
    console.log(`>>> ${issue.id} status updated to ${status}`);
    return issue;
  }

  resolveIssue(issueId, resolution) {
    const issue = this.issues.get(issueId);
    if (!issue) return console.log(`Issue ${issueId} not found`);

    issue.status = "Resolved";
    issue.resolution = resolution;

    const agent = this.agents.get(issue.assignedAgent);
    if (agent) {
      agent.workHistory.push(issue.id);
      agent.currentIssue = null;

      if (agent.queue.length > 0) {
        const nextIssueId = agent.queue.shift();
        const nextIssue = this.issues.get(nextIssueId);
        if (nextIssue) {
          agent.currentIssue = nextIssue.id;
          nextIssue.assignedAgent = agent.id;
          console.log(`>>> Next issue ${nextIssue.id} assigned to agent ${agent.id}`);
        }
      }
    }

    console.log(`>>> ${issue.id} issue marked resolved`);
    return issue;
  }

  viewAgentsWorkHistory() {
    for (let agent of this.agents.values()) {
      console.log(`${agent.id} -> {${agent.workHistory.join(", ")}}`);
    }
  }
}

if (require.main === module) {
  const sys = new ComplaintSystem();

  sys.createIssue("T1", "Payment Related", "Payment Failed", "My payment failed but money is debited", "testUser1@test.com");
  sys.createIssue("T2", "Mutual Fund Related", "Purchase Failed", "Unable to purchase Mutual Fund", "testUser2@test.com");
  sys.createIssue("T3", "Payment Related", "Payment Failed", "My payment failed but money is debited", "testUser2@test.com");

  sys.addAgent("agent1@test.com", "Agent 1", ["Payment Related", "Gold Related"]);
  sys.addAgent("agent2@test.com", "Agent 2", ["Payment Related"]);

  sys.assignIssue("I1");
  sys.assignIssue("I2");
  sys.assignIssue("I3");

  sys.getIssues({ email: "testUser2@test.com" });
  sys.getIssues({ type: "Payment Related" });

  sys.updateIssue("I3", "In Progress", "Waiting for payment confirmation");
  sys.resolveIssue("I3", "PaymentFailed debited amount will get reversed");

  sys.viewAgentsWorkHistory();
}

module.exports = { ComplaintSystem };
