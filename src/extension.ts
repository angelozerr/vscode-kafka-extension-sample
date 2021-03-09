// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { Kafka } from 'kafkajs';
import * as vscode from 'vscode';

/**
 * The supported SASL mechanisms for authentication.
 */
export type SaslMechanism = "plain" | "scram-sha-256" | "scram-sha-512";

export interface SaslOption {
	mechanism: SaslMechanism;
	username?: string;
	password?: string;
}

export interface ConnectionOptions {
	clusterProviderId?: string;
	bootstrap: string;
	saslOption?: SaslOption;
	ssl?: boolean;
}

export interface ClusterIdentifier {
	clusterProviderId?: string;
	id: string;
	name: string;
}

export interface Cluster extends ClusterIdentifier, ConnectionOptions {

}

export interface ClusterSettings {

}

export interface ClusterProviderProcessor {
	collectClusters(clusterSettings: ClusterSettings): Promise<Cluster[] | undefined>;
	createKafka?(connectionOptions: ConnectionOptions): Kafka;
}

class MyClusterProviderProcessor implements ClusterProviderProcessor {
	async collectClusters(clusterSettings: ClusterSettings): Promise<Cluster[] | undefined> {
		return [
			{
				bootstrap: "localhost:9092",
				id: "my-cluster",
				name: "My Cluster",
				clusterProviderId: "my-cluster-provider",
			}
		]
	}
	createKafka(connectionOptions: ConnectionOptions): Kafka {
		return new Kafka({
			clientId: "vscode-kafka",
			brokers: connectionOptions.bootstrap.split(","),
			ssl: connectionOptions.ssl
		})
	}
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

	let a = vscode.commands.registerCommand('vscode-kafka-extension-sample.cluster.providers', () => {

		return {

			collectClusters: async (clusterSettings: ClusterSettings): Promise<Cluster[] | undefined> => {
				return [
					{
						bootstrap: "localhost:9092",
						id: "my-cluster",
						name: "My Cluster",
						clusterProviderId: "my-cluster-provider",
					}
				]
			},

			createKafka: (connectionOptions: ConnectionOptions): Kafka => {
				return new Kafka({
					clientId: "vscode-kafka",
					brokers: connectionOptions.bootstrap.split(","),
					ssl: connectionOptions.ssl
				})
			}
		} as ClusterProviderProcessor;
		//return new MyClusterProviderProcessor()
	});
	context.subscriptions.push(a);

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscode-kafka-extension-sample" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('vscode-kafka-extension-sample.helloWorld', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from vscode-kafka-extension-sample!');
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
