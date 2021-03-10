// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { KafkaConfig } from 'kafkajs';
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

export interface KafkaExtensionParticipant {

	getClusterProviderParticipant(clusterProviderId: string): ClusterProviderParticipant;

}

/**
 * The kafka extension participant.
 */
export interface ClusterProviderParticipant {

	/**
	 * Returns the Kafka clusters managed by this participant.
	 *
	 * @param clusterSettings the current cluster settings.
	 */
	configureClusters(clusterSettings: ClusterSettings): Promise<Cluster[] | undefined>;

	/**
	 * Create the KafkaJS client configuration from the given connection options.
	 * When the participant doesn't implement this method, the KafkaJS client
	 * configuration is created with the default client configuration factory from vscode-kafka.
	 *
	 * @param connectionOptions the Kafka connection options.
	 */
	createKafkaConfig?(connectionOptions: ConnectionOptions): KafkaConfig;
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext): Promise<KafkaExtensionParticipant> {
	return {
		getClusterProviderParticipant: (clusterProviderId: string): ClusterProviderParticipant => {
			switch (clusterProviderId) {

				case 'my-cluster-provider-error':
					throw new Error('my-cluster-provider-error');

				case 'my-cluster-provider-error-in-collectClusters':
					return {

						configureClusters: async (clusterSettings: ClusterSettings): Promise<Cluster[] | undefined> => {
							throw new Error('my-cluster-provider-error-in-collectClusters');
						}
					};

				default:
					return {

						configureClusters: async (clusterSettings: ClusterSettings): Promise<Cluster[] | undefined> => {
							return [
								{
									bootstrap: "localhost:9092",
									id: "my-cluster",
									name: "My Cluster",
									clusterProviderId: "my-cluster-provider",
								},
								{
									bootstrap: "localhost:9092",
									id: "my-cluster2",
									name: "My Cluster 2",
									clusterProviderId: "my-cluster-provider",
								}
							];
						},

						createKafkaConfig: (connectionOptions: ConnectionOptions): KafkaConfig => {
							return {
								clientId: "vscode-kafka",
								brokers: connectionOptions.bootstrap.split(","),
								ssl: connectionOptions.ssl
							};
						}
					};
			}
		}
	};

}

// this method is called when your extension is deactivated
export function deactivate() { }
